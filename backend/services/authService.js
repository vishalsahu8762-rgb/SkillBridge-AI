const crypto = require('crypto');
const User = require('../models/User');

// Helper to hash password
const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

// Helper to generate salt
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Helper to generate auth token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Pre-seeded prototype users (used in-memory and seeded to DB)
const createPreseededUsers = () => {
  const salt1 = generateSalt();
  const salt2 = generateSalt();
  const salt3 = generateSalt();

  return [
    {
      _id: 'usr-trainee-1',
      id: 'usr-trainee-1',
      name: 'Vishal Sahu',
      email: 'trainee@skillbridge.ai',
      passwordHash: hashPassword('password123', salt1),
      salt: salt1,
      role: 'TRAINEE',
      district: 'Bhopal',
      currentSkills: ['Python', 'SQL', 'HTML', 'JavaScript'],
      targetRole: 'Full Stack Developer',
      companyName: '',
      industry: '',
      hiringRoles: []
    },
    {
      _id: 'usr-employer-1',
      id: 'usr-employer-1',
      name: 'Rahul Sharma',
      email: 'employer@skillbridge.ai',
      passwordHash: hashPassword('password123', salt2),
      salt: salt2,
      role: 'EMPLOYER',
      district: 'Bhopal',
      currentSkills: [],
      targetRole: '',
      companyName: 'Tech Solutions Pvt Ltd',
      industry: 'IT Services',
      hiringRoles: ['Full Stack Developer', 'Cloud Engineer']
    },
    {
      _id: 'usr-admin-1',
      id: 'usr-admin-1',
      name: 'System Administrator',
      email: 'admin@skillbridge.ai',
      passwordHash: hashPassword('password123', salt3),
      salt: salt3,
      role: 'ADMIN',
      district: 'Bhopal',
      currentSkills: [],
      targetRole: '',
      companyName: 'SkillBridge AI Admin Core',
      industry: 'Public Sector Tech',
      hiringRoles: []
    }
  ];
};

let sampleUsers = createPreseededUsers();
let activeTokens = new Map(); // token -> userId mapping

// Pre-register active tokens for demo accounts
sampleUsers.forEach(u => {
  const demoToken = `token_${u.role.toLowerCase()}_demo`;
  activeTokens.set(demoToken, u._id || u.id);
});

/**
 * Format user payload without sensitive fields
 */
const sanitizeUser = (user) => {
  const u = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete u.passwordHash;
  delete u.salt;
  delete u.__v;
  return u;
};

/**
 * Sign up new user
 */
const signupUserService = async (userData) => {
  const { name, email, password, role, district, currentSkills, targetRole, companyName, industry, hiringRoles } = userData;

  const normalizedEmail = email.toLowerCase().trim();

  // Check duplicate in DB or sample array
  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error('Email is already registered');
    }
  } catch (error) {
    if (error.message === 'Email is already registered') throw error;
  }

  if (sampleUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Email is already registered');
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);

  const newUserPayload = {
    name,
    email: normalizedEmail,
    passwordHash,
    salt,
    role: role || 'TRAINEE',
    district: district || 'Bhopal',
    currentSkills: Array.isArray(currentSkills) ? currentSkills : (currentSkills ? currentSkills.split(',').map(s => s.trim()) : []),
    targetRole: targetRole || 'Full Stack Developer',
    companyName: companyName || '',
    industry: industry || 'IT Services',
    hiringRoles: Array.isArray(hiringRoles) ? hiringRoles : (hiringRoles ? hiringRoles.split(',').map(s => s.trim()) : [])
  };

  let createdUser = null;
  try {
    const dbUser = new User(newUserPayload);
    const saved = await dbUser.save();
    createdUser = saved.toObject();
  } catch (error) {
    console.warn('MongoDB User save failed, using in-memory store:', error.message);
    const newId = `usr-${Date.now()}`;
    createdUser = {
      _id: newId,
      id: newId,
      ...newUserPayload
    };
    sampleUsers.push(createdUser);
  }

  const token = generateToken();
  activeTokens.set(token, createdUser._id || createdUser.id);

  return {
    user: sanitizeUser(createdUser),
    token
  };
};

/**
 * Login user
 */
const loginUserService = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();

  let targetUser = null;

  try {
    const dbUser = await User.findOne({ email: normalizedEmail }).lean();
    if (dbUser) {
      targetUser = dbUser;
    }
  } catch (error) {
    console.warn('MongoDB user lookup failed:', error.message);
  }

  if (!targetUser) {
    targetUser = sampleUsers.find(u => u.email.toLowerCase() === normalizedEmail);
  }

  if (!targetUser) {
    throw new Error('Invalid email or password');
  }

  const computedHash = hashPassword(password, targetUser.salt);
  if (computedHash !== targetUser.passwordHash) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken();
  activeTokens.set(token, targetUser._id || targetUser.id);

  return {
    user: sanitizeUser(targetUser),
    token
  };
};

/**
 * Get user by token
 */
const getUserByTokenService = async (token) => {
  if (!token) return null;

  const userId = activeTokens.get(token);
  if (!userId) return null;

  try {
    if (String(userId).match(/^[0-9a-fA-F]{24}$/)) {
      const dbUser = await User.findById(userId).lean();
      if (dbUser) return sanitizeUser(dbUser);
    }
  } catch (error) {
    console.warn('MongoDB lookup error:', error.message);
  }

  const sampleUser = sampleUsers.find(u => String(u._id) === String(userId) || String(u.id) === String(userId));
  if (!sampleUser) return null;
  return sanitizeUser(sampleUser);
};

/**
 * Update user profile
 */
const updateUserProfileService = async (userId, updateFields) => {
  // Prevent role mutation
  delete updateFields.role;
  delete updateFields.email;
  delete updateFields.passwordHash;
  delete updateFields.salt;

  try {
    if (String(userId).match(/^[0-9a-fA-F]{24}$/)) {
      const dbUser = await User.findById(userId);
      if (dbUser) {
        Object.assign(dbUser, updateFields);
        const saved = await dbUser.save();
        return sanitizeUser(saved.toObject());
      }
    }
  } catch (error) {
    console.warn('MongoDB update failed, updating in-memory store:', error.message);
  }

  const index = sampleUsers.findIndex(u => String(u._id) === String(userId) || String(u.id) === String(userId));
  if (index !== -1) {
    Object.assign(sampleUsers[index], updateFields);
    return sanitizeUser(sampleUsers[index]);
  }

  throw new Error('User not found for update');
};

/**
 * Logout
 */
const logoutUserService = (token) => {
  if (token) {
    activeTokens.delete(token);
  }
  return true;
};

module.exports = {
  signupUserService,
  loginUserService,
  getUserByTokenService,
  updateUserProfileService,
  logoutUserService,
  sampleUsers
};
