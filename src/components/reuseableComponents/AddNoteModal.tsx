"use client";

import { Modal, Input } from "antd";
import { getCallTypeColor } from "@/lib/helpers";

// Import the Call type from where it's already declared
import type { Call } from "@/app/(dashboard)/calls/page"; // adjust path if different

interface AddNoteModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  call: Call | null;
  note: string;
  setNote: (val: string) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
  open,
  onCancel,
  onSubmit,
  call,
  note,
  setNote,
}) => {
  return (
    <Modal
      title={
        <>
          <div className="avenir-book text-[18px] text-black">Add Note</div>
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3 text-[#4F46F8]">
            <div>Call ID:</div>
            <div>{call?.id}</div>
          </div>
        </>
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Save"
    >
      {call && (
        <div className="space-y-3 border-y-2 py-5">
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3">
            <div>Call Type:</div>
            <div style={{ color: getCallTypeColor(call.call_type) }}>
              {call.call_type}
            </div>
          </div>
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3">
            <div>Duration:</div>
            <div>
              {`${Math.floor(call.duration / 60)} minutes ${
                call.duration % 60
              } seconds`}
            </div>
          </div>
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3">
            <div>From:</div>
            <div>{call.from}</div>
          </div>
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3">
            <div>To:</div>
            <div>{call.to}</div>
          </div>
          <div className="avenir-book text-[12px] flex flex-row items-center gap-3">
            <div>VIA:</div>
            <div>{call.via}</div>
          </div>

          <div>
            <div>Notes</div>
            <Input.TextArea
              placeholder="Add note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddNoteModal;
