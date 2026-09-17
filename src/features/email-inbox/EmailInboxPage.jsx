// features/email-inbox/EmailInboxPage.jsx
import { useState } from 'react';
import './EmailInbox.css';
import FavoritesPanel from './components/FavoritesPanel';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import CopilotPanel from './components/CopilotPanel';
import Modal from '../../components/ui/Modal/Modal';
import { useEmails } from './hooks/useEmails';
import { useLogisticsForEmail } from './hooks/useLogisticsForEmail';

export default function EmailInboxPage() {
  const {
    emails, selectedEmail, selectedId, selectEmail, removeEmail, deletingId,
    filter, setFilter, loading, error,
  } = useEmails();
  const [copilotOpen, setCopilotOpen] = useState(false);
  // Fetches GET /emails/logistics/{emailId} for whichever email is
  // currently selected, instead of pulling all 100 logistics records
  // up front and matching client-side (that approach — and its now-
  // deleted useLogistics.js hook — is still available via
  // logisticsApi.js's fetchLogisticsData if a future "all shipments"
  // list view needs it).
  const { logistics, loading: logisticsLoading } = useLogisticsForEmail(selectedEmail?.id);
  // Mobile only: which pane is showing — the inbox list or the open
  // email. Desktop always renders both side by side (see EmailInbox.css,
  // `.sc-app[data-screen=...]` rules only apply below 639px).
  const [screen, setScreen] = useState('list');
  const [replyValue, setReplyValue] = useState('');
  // Holds the email object while the delete-confirm modal is open — same
  // pattern as RolesPage/UsersPage/PermissionsPage's own delete-confirm
  // flow (roleToDelete / userToDelete / permissionToDelete), using the
  // same shared Modal component instead of window.confirm.
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleSelectEmail = (id) => {
    selectEmail(id);
    setScreen('detail');
  };

  const handleBackToList = () => setScreen('list');

  const handleSendReply = () => {
    if (!replyValue.trim()) return;
    // No send API yet — clear the draft so the box resets like a sent
    // reply would. Wire this to a real send endpoint later.
    setReplyValue('');
  };

  // Copilot's "Use in Reply" button hands its draft text here so the
  // person can review/edit it in the real reply box before sending.
  const handleUseDraft = (text) => {
    setReplyValue(text);
    setCopilotOpen(false);
  };

  const requestDeleteEmail = () => {
    setDeleteError(null);
    setEmailToDelete(selectedEmail);
  };

  const cancelDeleteEmail = () => {
    if (deletingId) return; // don't allow closing mid-delete
    setEmailToDelete(null);
  };

  const confirmDeleteEmail = async () => {
    if (!emailToDelete) return;
    try {
      await removeEmail(emailToDelete.id);
      setEmailToDelete(null);
      setScreen('list'); // nothing left to show on mobile
    } catch (err) {
      // removeEmail already restored the email in the list — keep the
      // modal open and show why it failed instead of silently closing.
      setDeleteError(err.message || 'Failed to delete email. Please try again.');
    }
  };

  return (
    <div className="sc-email-inbox sc-app sc-main-row flex-grow-1 d-flex overflow-hidden h-100" data-screen={screen}>
      <FavoritesPanel />
      <EmailList
        emails={emails}
        selectedId={selectedId}
        onSelect={handleSelectEmail}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        error={error}
      />
      <EmailDetail
        email={selectedEmail}
        onBack={handleBackToList}
        onDelete={requestDeleteEmail}
        deleting={selectedEmail ? deletingId === selectedEmail.id : false}
        replyValue={replyValue}
        onReplyChange={setReplyValue}
        onSend={handleSendReply}
        onOpenCopilot={() => setCopilotOpen(true)}
      />
      <CopilotPanel
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onUseDraft={handleUseDraft}
        logistics={logistics}
        logisticsLoading={logisticsLoading}
      />

      <button
        type="button"
        aria-label="Open Copilot AI Assistant"
        data-tooltip="Reply with Copilot"
        className="sc-ai-fab d-none rounded-circle border align-items-center justify-content-center"
        onClick={() => setCopilotOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.17l1.05 4.1c.1.36.29.68.56.95.27.27.6.46.95.56l4.1 1.05-4.1 1.05c-.36.1-.68.29-.95.56-.27.27-.46.6-.56.95L8 14.83l-1.05-4.1a2 2 0 00-.56-.95 2 2 0 00-.95-.56L1.34 8.17l4.1-1.05c.36-.1.68-.29.95-.56.27-.27.46-.6.56-.95L8 1.17z"
          stroke="#7c3aed" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
        </svg>
      </button>

      <Modal
        open={Boolean(emailToDelete)}
        onClose={cancelDeleteEmail}
        title="Delete Email"
        footer={
          <>
            <button type="button" className="btn btn-outline-secondary" onClick={cancelDeleteEmail} disabled={Boolean(deletingId)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDeleteEmail} disabled={Boolean(deletingId)}>
              {deletingId ? 'Deleting…' : 'Delete Email'}
            </button>
          </>
        }
      >
        {deleteError && <p className="text-danger small mb-2">{deleteError}</p>}
        <p className="mb-0">
          Are you sure you want to delete <strong>{emailToDelete?.fullSubject || emailToDelete?.subject}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}