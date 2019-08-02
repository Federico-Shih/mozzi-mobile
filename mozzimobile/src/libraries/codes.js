export default {
  success: 0,

  unalteredValues: 'unalteredValues', // The client is trying to update a record with the same valeus already present

  badJson: 'badJson', // One or more parameters given by the client are in the wrong format or off the limits

  duplicateValues: 'duplicateValues', // One or more parameters given by the client are already loaded on to the system
  duplicateMembers: 'duplicateMembers', // The member that is being added to the system already exists in it

  hasSession: 'hasSession', // The user already has a valid session
  noSession: 'noSession', // The user has no active session and cannot acces to the desired resource

  wrongPassword: 'wrongPassword', // Incorrect password given by the client at login
  wrongEmail: 'wrongEmail', // Invalid email given by the client at login

  noBusiness: 'noBusiness', // No businesses found for the given parameters or not present in the database
  noGroup: 'noGroup', // The referenced group does not exist in the system
  noUser: 'noUser', // The referenced user does not exist in the system
  noMember: 'noMember', // The referenced member does not exist in the system
};
