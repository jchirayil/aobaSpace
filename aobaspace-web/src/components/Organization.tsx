import React from 'react';

interface OrganizationData {
  id: string;
  name: string;
  role: string;
}

interface OrgFormState {
  name: string;
  description: string;
}

interface EditingOrgDetails {
  name: string;
  description: string;
  websiteUrl: string;
  address: string;
}

interface OrganizationProps {
  organizations: OrganizationData[];
  selectedOrgId: string | null;
  setSelectedOrgId: (id: string) => void;
  onAddOrg: (e: React.FormEvent) => void;
  onEditOrg: (e: React.FormEvent) => void;
  onRemoveOrg: (orgId: string) => void;
  orgMessage: string;
  orgError: string;
  isAddingOrg: boolean;
  setIsAddingOrg: (value: boolean) => void;
  isEditingOrg: boolean;
  setIsEditingOrg: (value: boolean) => void;
  orgFormState: OrgFormState;
  setOrgFormState: (state: OrgFormState) => void;
  canEditOrgDetails: boolean;
  editingOrgDetails: EditingOrgDetails;
  setEditingOrgDetails: (details: EditingOrgDetails) => void;
}

const Organization: React.FC<OrganizationProps> = ({
  organizations,
  selectedOrgId,
  setSelectedOrgId,
  onAddOrg,
  onEditOrg,
  onRemoveOrg,
  orgMessage,
  orgError,
  isAddingOrg,
  setIsAddingOrg,
  isEditingOrg,
  setIsEditingOrg,
  orgFormState,
  setOrgFormState,
  canEditOrgDetails,
  editingOrgDetails,
  setEditingOrgDetails,
}) => {
  return (
    <section className="border-t border-gray-200 pt-8 mt-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Organizations</h2>
    {orgMessage && <p className="text-green-600 mt-4">{orgMessage}</p>}
    {orgError && <p className="text-red-600 mt-4">{orgError}</p>}
    <button
      onClick={() => setIsAddingOrg(!isAddingOrg)}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mr-2 mb-4"
    >
      {isAddingOrg ? 'Cancel Add Organization' : 'Add New Organization'}
    </button>
    {isAddingOrg && (
      <form onSubmit={onAddOrg} className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Create New Organization</h3>
        <div>
          <label htmlFor="newOrgName" className="block text-gray-700 text-sm font-bold mb-2">Organization Name:</label>
          <input type="text" id="newOrgName" value={orgFormState.name} onChange={e => setOrgFormState({ ...orgFormState, name: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div>
          <label htmlFor="newOrgDescription" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional):</label>
          <textarea id="newOrgDescription" value={orgFormState.description} onChange={e => setOrgFormState({ ...orgFormState, description: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
          Create Organization
        </button>
      </form>
    )}
    {organizations && organizations.length > 0 ? (
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Your Organizations</h3>
        <select
          value={selectedOrgId || ''}
          onChange={e => setSelectedOrgId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          aria-label="Select Organization"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name} ({org.role})
            </option>
          ))}
        </select>
        {selectedOrgId && (
          <div className="mt-4 flex space-x-2">
            {canEditOrgDetails && (
              <button
                onClick={() => setIsEditingOrg(!isEditingOrg)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                {isEditingOrg ? 'Cancel Edit' : 'Edit Organization'}
              </button>
            )}
            {canEditOrgDetails && (
              <button
                onClick={() => onRemoveOrg(selectedOrgId)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Remove Organization
              </button>
            )}
          </div>
        )}
        {isEditingOrg && canEditOrgDetails && (
          <form onSubmit={onEditOrg} className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">Edit Organization Details</h3>
            <div>
              <label htmlFor="editOrgName" className="block text-gray-700 text-sm font-bold mb-2">Organization Name:</label>
              <input type="text" id="editOrgName" value={editingOrgDetails.name} onChange={e => setEditingOrgDetails({ ...editingOrgDetails, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>
            <div>
              <label htmlFor="editOrgDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <textarea id="editOrgDescription" value={editingOrgDetails.description} onChange={e => setEditingOrgDetails({ ...editingOrgDetails, description: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
            </div>
            <div>
              <label htmlFor="editOrgWebsite" className="block text-gray-700 text-sm font-bold mb-2">Website URL:</label>
              <input type="url" id="editOrgWebsite" value={editingOrgDetails.websiteUrl} onChange={e => setEditingOrgDetails({ ...editingOrgDetails, websiteUrl: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
              <label htmlFor="editOrgAddress" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
              <input type="text" id="editOrgAddress" value={editingOrgDetails.address} onChange={e => setEditingOrgDetails({ ...editingOrgDetails, address: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">Save Changes</button>
          </form>
        )}
      </div>
    ) : (
      <p className="text-gray-600">You are not associated with any organizations yet. Add one above!</p>
    )}
    </section>
  );
};

export default Organization;