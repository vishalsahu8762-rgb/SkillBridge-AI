const { OpenAI } = require('openai');
const normalize = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const normalizeReading = (score) => typeof score === 'number' ? Math.max(0, Math.min(100, score)) : null;

const getHighestPrioritySkill = (missingSkills, gapLevels) => {
  if (!Array.isArray(missingSkills) || missingSkills.length === 0) return null;

  if (gapLevels && Array.isArray(gapLevels.high) && gapLevels.high.length > 0) {
    return gapLevels.high[0];
  }

  return missingSkills[0];
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const fallbackSkillGapAssistantReply = (question, context = {}, history = []) => {
  const safeQuestion = String(question || '').trim().toLowerCase();
  const targetRole = context.targetRole || 'your selected role';
  const currentSkills = normalize(context.currentSkills);
  const matchedSkills = normalize(context.matchedSkills);
  const missingSkills = normalize(context.missingSkills);
  const recommendations = Array.isArray(context.recommendations?.learningPath)
    ? context.recommendations.learningPath
    : Array.isArray(context.recommendations)
      ? context.recommendations
      : Array.isArray(context.learningPath)
        ? context.learningPath
        : [];
  const readinessScore = normalizeReading(context.readinessScore);
  const gapLevels = context.gapLevels || {};

  if (!targetRole || targetRole === 'your selected role' || (!matchedSkills.length && !missingSkills.length)) {
    return 'Please analyze your skill gap first. Once your analysis is ready, I can give you personalized guidance.';
  }

  const historyQuestion = Array.isArray(history)
    ? history
        .filter(item => item && typeof item.content === 'string')
        .slice(-4)
        .map(item => item.content)
        .join(' ')
        .toLowerCase()
    : '';

  const followup = historyQuestion.includes('why') || historyQuestion.includes('what')
    || safeQuestion.includes('why') || safeQuestion.includes('what');

  if (safeQuestion.includes('what should i learn first') || safeQuestion.includes('which skill should i learn first') || safeQuestion.includes('learn first')) {
    if (missingSkills.length === 0) {
      return `Your current analysis already shows that you are aligned with ${targetRole}. Keep strengthening your matched skills and revisit the analyzer after new practice.`;
    }

    const firstSkill = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    return `Start with ${firstSkill}. In your current ${targetRole} gap analysis, it is one of the clearest missing skills to prioritize before you continue with the rest of the learning path.`;
  }

  if (safeQuestion.includes('why') && safeQuestion.includes('react')) {
    return `React is showing as important because your current analysis for ${targetRole} expects React as a missing skill, and the analyzer has matched your selected skills with that role demand. Since you already know JavaScript, React is a natural next step because it is the front-end skill that connects JavaScript knowledge to reusable role-ready UI building.`;
  }

  if (safeQuestion.includes('javascript') && safeQuestion.includes('react') && safeQuestion.includes('missing')) {
    return `JavaScript and React are related but they are not the same skill. JavaScript shows your foundation, while React is the framework used to build UI components and app structure for a role such as ${targetRole}. That is why React can still appear as a gap even when JavaScript is already in your current skills.`;
  }

  if (safeQuestion.includes('roadmap') || safeQuestion.includes('plan') || safeQuestion.includes('road map')) {
    if (missingSkills.length === 0) {
      return `You do not have a current missing skill in this analysis. Keep following your strongest matched skills and continue to practice your selected role through real project work.`;
    }

    const firstSkill = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    const nextSkills = missingSkills.slice(0, Math.min(3, missingSkills.length)).join(', ');
    return `A practical roadmap for ${targetRole} starts with ${firstSkill}, then moves through ${nextSkills}. Use your available recommendations and learning path to practice one skill at a time, then revisit the analyzer after each milestone.`;
  }

  if (safeQuestion.includes('project') || safeQuestion.includes('build') || safeQuestion.includes('portfolio')) {
    const skillSet = missingSkills.length > 0 ? missingSkills.slice(0, 3).join(', ') : matchedSkills.slice(0, 3).join(', ');
    return `For ${targetRole}, build a project that demonstrates ${skillSet} in a connected flow. A useful starting project is a small full-stack application where you use the matched skills and then show the missing skills through a clear UI, API, and deployment flow. Keep the project grounded in the skills already visible in your analysis.`;
  }

  if (safeQuestion.includes('how long') || safeQuestion.includes('job ready') || safeQuestion.includes('ready')) {
    if (readinessScore === null) {
      return `Your current readiness score is not available in the requested context. Review the Skill Gap analysis and use the missing skills order to create a realistic learning sequence for ${targetRole}.`;
    }

    return `Your current readiness score is ${readinessScore}%. That means there is still a learning path to close the gap around ${targetRole}. Focus on the current missing skills in the order shown by the analyzer and recommendations, then re-run the analysis after you improve those skills.`;
  }

  if (safeQuestion.includes('important') || safeQuestion.includes('priority') || safeQuestion.includes('highest priority')) {
    if (missingSkills.length === 0) {
      return `There is no current missing skill in this analysis for ${targetRole}. Continue to reinforce your matched skills and check the selected role again later.`;
    }

    const highSkill = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    return `The highest immediate priority skill in your current analysis is ${highSkill}. It appears as the most useful missing skill to address first for ${targetRole}.`;
  }

  if (safeQuestion.includes('which missing skill') || safeQuestion.includes('missing skill')) {
    if (missingSkills.length === 0) {
      return `Your current analysis shows no missing skills for ${targetRole}. You can continue building your matched skills and re-run the analyzer if your role or skills change.`;
    }

    const firstSkill = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    return `The first missing skill to focus on is ${firstSkill}. It is the most relevant gap in your current ${targetRole} analysis, and it should be addressed before the other skills in the missing list.`;
  }

  if (safeQuestion.includes('mongo') || safeQuestion.includes('mongodb') || safeQuestion.includes('can i get a job without')) {
    return `Your analysis only tells us what is currently missing from the ${targetRole} profile. MongoDB is in the current missing skills list in your analysis, so it should be treated as a role-relevant skill to improve rather than something you can safely skip if your goal is a stronger match for ${targetRole}.`;
  }

  if (safeQuestion.includes('explain') || safeQuestion.includes('simple words')) {
    if (missingSkills.length === 0) {
      return `Your skill gap is already small for ${targetRole}. Your strongest skills are ${matchedSkills.join(', ') || 'not listed yet'}, and your current profile is close to the expected role profile.`;
    }

    return `Your skill gap is the difference between the skills you already know, such as ${matchedSkills.join(', ') || 'your selected skills'}, and the skills the ${targetRole} profile still needs, such as ${missingSkills.join(', ')}. Work through those missing skills in the order shown by the learning path and recommendations.`;
  }

  if (safeQuestion.includes('why') || safeQuestion.includes('because')) {
    if (missingSkills.length === 0) {
      return `Your current skills already match the selected role closely, so there is no major gap visible in this analysis for ${targetRole}.`;
    }

    const firstSkill = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    return `The current analysis highlights ${firstSkill} because it is still missing from your selected skills for ${targetRole}. It is the skill that should be addressed next in the learning path.`;
  }

  if (safeQuestion.includes('git')) {
    return `Git is important because it is a common project, version-control, and collaboration skill required for modern role workflows. If Git appears in your missing list, practice commit history, branching, and pull requests before you move from a basic project to a stronger role-ready project.`;
  }

  if (safeQuestion.includes('why') && missingSkills.length > 0 && recommendations.length > 0) {
    return `The recommendation path is built from your current missing skills for ${targetRole}. Focus on ${missingSkills[0]} first because it connects directly to the learning sequence and the readiness score shown in the analyzer.`;
  }

  if (safeQuestion.includes('learn')) {
    if (missingSkills.length === 0) {
      return `You already show a strong skill match for ${targetRole}. Continue reinforcing your matched skills through project practice and role-based learning.`;
    }

    const firstMissing = getHighestPrioritySkill(missingSkills, gapLevels) || missingSkills[0];
    return `The best first skill to learn is ${firstMissing}. It appears as a priority skill in your current ${targetRole} gap analysis, and it should be the starting point before the rest of your learning path.`;
  }

  const firstMissing = missingSkills[0] || 'your most relevant missing skill';
  const missingSentence = missingSkills.length > 0 ? `Your current missing skills include ${missingSkills.join(', ')}.` : 'There are no visible missing skills in this analysis.';
  const readinessSentence = readinessScore === null ? 'Your readiness score is not available in the current context.' : `Your readiness score is ${readinessScore}%.`;

  return `For ${targetRole}, ${missingSentence} ${readinessSentence} Use the learning path recommendations and focus on ${firstMissing} as your first practical next move, then build a project around that skill before expanding your skill set.`;
};

const buildSkillGapPrompt = (question, context = {}, history = []) => {
  const targetRole = context.targetRole || 'your selected role';
  const currentSkills = normalize(context.currentSkills);
  const matchedSkills = normalize(context.matchedSkills);
  const missingSkills = normalize(context.missingSkills);
  const recommendations = Array.isArray(context.recommendations?.learningPath)
    ? context.recommendations.learningPath
    : Array.isArray(context.recommendations)
      ? context.recommendations
      : Array.isArray(context.learningPath)
        ? context.learningPath
        : [];
  const readinessScore = normalizeReading(context.readinessScore);
  const gapLevels = context.gapLevels || {};

  const historyMessages = Array.isArray(history)
    ? history
        .filter(item => item && typeof item.role === 'string' && typeof item.content === 'string')
        .slice(-6)
        .map(item => `${item.role}: ${item.content}`)
        .join('\n')
    : '';

  return [
    'You are SkillBridge AI Career Assistant for the Skill Gap Analyzer.',
    'Use only the supplied Skill Gap Analyzer context and not unsupported facts.',
    'The user question is the primary instruction; previous conversation is context only.',
    `Target job role: ${targetRole}`,
    `Current skills: ${currentSkills.join(', ') || 'none provided'}`,
    `Matched skills: ${matchedSkills.join(', ') || 'none provided'}`,
    `Missing skills: ${missingSkills.join(', ') || 'none provided'}`,
    `Priority gaps: ${JSON.stringify(gapLevels)}`,
    `Readiness score: ${readinessScore === null ? 'not provided' : `${readinessScore}%`}`,
    `Learning path: ${Array.isArray(recommendations) ? recommendations.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(' | ') : 'none provided'}`,
    `Conversation history:\n${historyMessages}`,
    `Current user question: ${question}`
  ].join('\n');
};

const generateSkillGapAssistantReply = async (question, context = {}, history = []) => {
  if (!openai) {
    return fallbackSkillGapAssistantReply(question, context, history);
  }

  try {
    const prompt = buildSkillGapPrompt(question, context, history);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.4,
      max_tokens: 250,
      messages: [
        {
          role: 'system',
          content: 'You are SkillBridge AI Career Assistant for a Skill Gap Analyzer. Answer only from the supplied user context and prior chat history, and do not invent unsupported facts.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = completion?.choices?.[0]?.message?.content;
    if (typeof text === 'string' && text.trim()) {
      return text.trim();
    }

    return fallbackSkillGapAssistantReply(question, context, history);
  } catch (error) {
    console.warn('OpenAI provider error:', error?.message || error);
    return fallbackSkillGapAssistantReply(question, context, history);
  }
};

module.exports = {
  generateSkillGapAssistantReply,
  fallbackSkillGapAssistantReply
};
