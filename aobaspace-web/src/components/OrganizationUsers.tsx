import React from 'react';

interface OrgUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface InviteState {
  email: string;
  role: string;
}

interface OrganizationUsersProps {
  orgUsers: OrgUser[];
  canManage: boolean;
  onInviteUser: (e: React.FormEvent) => void;
  onRemoveUser: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: string) => void;
  onForcePasswordReset: (userId: string) => void;
  inviteState: InviteState;
  setInviteState: (state: InviteState) => void;
  inviteMessage: string;
  inviteError: string;
}


const OrganizationUsers: React.FC<OrganizationUsersProps> = ({
  orgUsers,
  canManage,
  onInviteUser,
  onRemoveUser,
  onUpdateUserRole,
  onForcePasswordReset,
  inviteState,
  setInviteState,
  inviteMessage,
  inviteError,
}) => (
  <section className="mt-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Organization Users</h2>
    {inviteMessage && <p className="text-green-600 mb-2">{inviteMessage}</p>}
    {inviteError && <p className="text-red-600 mb-2">{inviteError}</p>}
    {canManage && (
      <form onSubmit={onInviteUser} className="mb-6 space-y-3">
        <h6 className="text-md font-semibold">Invite New User</h6>
        <div>
          <label htmlFor="inviteEmail" className="block text-gray-700 text-sm font-bold mb-1">User Email:</label>
          <input type="email" id="inviteEmail" value={inviteState.email} onChange={e => setInviteState({ ...inviteState, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="user@example.com" required />
        </div>
        <div>
          <label htmlFor="inviteRole" className="block text-gray-700 text-sm font-bold mb-1">Role:</label>
          <select id="inviteRole" value={inviteState.role} onChange={e => setInviteState({ ...inviteState, role: e.target.value })}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select Invite Role"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="billing_admin">Billing Admin</option>
            <option value="support_admin">Support Admin</option>
          </select>
        </div>
        <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200">
          Invite User
        </button>
      </form>
    )}
    {orgUsers.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {orgUsers.map((user) => (
          <li key={user.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-gray-900 font-medium">{user.firstName} {user.lastName} ({user.email})</p>
              <p className="text-sm text-gray-600">ID: {user.id} | Role: {user.role}</p>
            </div>
            {canManage && (
              <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                <select
                  value={user.role}
                  onChange={e => onUpdateUserRole(user.id, e.target.value)}
                  className="p-1 border border-gray-300 rounded-md text-sm"
                  aria-label={`Change role for ${user.firstName} ${user.lastName}`}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="billing_admin">Billing Admin</option>
                  <option value="support_admin">Support Admin</option>
                </select>
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded transition duration-200"
                >
                  Remove
                </button>
                <button
                  onClick={() => onForcePasswordReset(user.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-2 rounded transition duration-200"
                  title="Send password reset link (dummy)"
                >
                  Force Reset
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">No users found in this organization.</p>
    )}
  </section>
);

export default OrganizationUsers;