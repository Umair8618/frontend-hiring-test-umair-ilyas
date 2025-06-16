"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_CALLS, ON_UPDATE_CALL, ADD_NOTE, ARCHIVE_CALL } from "@/graphql/queries";
import { Table, Button, Tag, Spin, Select, Space, Modal, message } from "antd";
import moment from "moment";
import { ColumnsType } from "antd/es/table";
import Header from "@/components/reuseableComponents/Header";
import { getCallTypeColor } from "@/lib/helpers";
import AddNoteModal from "@/components/reuseableComponents/AddNoteModal";

const { Option } = Select;

interface Note {
  id: string;
  content: string;
}

export interface Call {
  id: string;
  direction: string;
  from: string;
  to: string;
  duration: number;
  is_archived: boolean;
  call_type: string;
  via: string;
  created_at: string;
  notes: Note[];
}

interface PaginatedCallsData {
  paginatedCalls: {
    nodes: Call[];
    totalCount: number;
    hasNextPage: boolean;
  };
}

export default function CallsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [statusFilter, setStatusFilter] = useState<"all" | "archived" | "unarchived">("all");

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, loading, refetch } = useQuery<PaginatedCallsData>(GET_CALLS, {
    variables: { offset, limit },
    fetchPolicy: "network-only",
  });

  const [addNote] = useMutation<{ addNote: Call }>(ADD_NOTE, {
    update(cache, { data: mutationData }) {
      if (!mutationData) return;
      const updatedCall = mutationData.addNote;

      const existing = cache.readQuery<PaginatedCallsData>({
        query: GET_CALLS,
        variables: { offset: 0, limit: 10 },
      });

      if (existing?.paginatedCalls?.nodes) {
        const newCalls = existing.paginatedCalls.nodes.map((call) =>
          call.id === updatedCall.id ? { ...call, notes: updatedCall.notes } : call
        );

        cache.writeQuery<PaginatedCallsData>({
          query: GET_CALLS,
          variables: { offset: 0, limit: 10 },
          data: {
            paginatedCalls: {
              ...existing.paginatedCalls,
              nodes: newCalls,
            },
          },
        });
      }
    },
  });

  const [archiveCallMutation] = useMutation<{ archiveCall: Call }>(ARCHIVE_CALL);

  useSubscription(ON_UPDATE_CALL, {
    variables: { id: null },
    onData: () => refetch(),
  });

  const filteredData = useMemo(() => {
    if (!data?.paginatedCalls?.nodes) return [];
    switch (statusFilter) {
      case "archived":
        return data.paginatedCalls.nodes.filter((call) => call.is_archived);
      case "unarchived":
        return data.paginatedCalls.nodes.filter((call) => !call.is_archived);
      default:
        return data.paginatedCalls.nodes;
    }
  }, [data, statusFilter]);

  // Columns definition
  const columns: ColumnsType<Call> = [
    {
      title: <span className="table-label">Call Type</span>,
      dataIndex: "call_type",
      render: (type: string) => (
        <div
          className="table-data capitalize"
          style={{ color: getCallTypeColor(type) }}
        >
          {type}
        </div>
      ),
    },
    {
      title: <span className="table-label">Direction</span>,
      dataIndex: "direction",
      render: (direction: string) => (
        <div className="table-data capitalize text-[#325AE7] text-[14px]">{direction}</div>
      ),
    },
   {
      title: <span className="table-label">Duaration</span>,
      dataIndex: "duration",
      render: (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return (
          <div>
            <div className="table-data capitalize text-[14px]">
              {minutes} minutes {remainingSeconds} seconds
            </div>
            <div className="table-data capitalize text-[#325AE7] text-[14px]">
              (seconds)
            </div>
          </div>
        );
      },
    },
    {
      title: <span className="table-label">From</span>,
      dataIndex: "from",
      render: (from: string) => (
        <div className="table-data capitalize text-[14px]">{from}</div>
      ),
    },
    {
      title: <span className="table-label">To</span>,
      dataIndex: "to",
      render: (to: string) => (
        <div className="table-data capitalize text-[14px]">{to}</div>
      ),
    },
    {
      title: <span className="table-label">Via</span>,
      dataIndex: "via",
      render: (via: string) => (
        <div className="table-data capitalize text-[14px]">{via}</div>
      ),
    },
    {
      title: <span className="table-label">Created At</span>,
      dataIndex: "created_at",
      render: (date: string) => (
        <div className="table-data capitalize text-[14px]">
          {moment(date).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      title: <span className="table-label">Status</span>,
      dataIndex: "is_archived",
      render: (archived: boolean) => (
        <Tag
          color={archived ? "#1DC9B7" : "#727272"}
          className="table-data capitalize text-[14px]"
        >
          {archived ? "Archived" : "Unarchived"}
        </Tag>
      ),
    },
    {
      title: <span className="table-label">Actions</span>,
      dataIndex: "id",
      render: (_, record) => (
        <div className="flex gap-2 table-data capitalize text-[14px]">
          <Button type="primary" onClick={() => openModal(record)}>
            Add Note
          </Button>
        </div>
      ),
    },
  ];

  // Modal handlers for notes
  const openModal = (call: Call) => {
    setSelectedCall(call);
    setNote("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  const handleSaveNote = async () => {
    if (!note.trim() || !selectedCall) return;
    try {
      await addNote({
        variables: { input: { activityId: selectedCall.id, content: note } },
      });
      message.success("Note added successfully");
      closeModal();
    } catch (error) {
      console.error("Failed to add note:", error);
      message.error("Failed to add note");
    }
  };

  // Batch archive/unarchive handler
  const handleArchiveCalls = () => {
    if (selectedRowKeys.length === 0) {
      message.info("Please select calls to archive/unarchive");
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to toggle archive status for ${selectedRowKeys.length} call(s)?`,
      onOk: async () => {
        try {
          for (const id of selectedRowKeys) {
            await archiveCallMutation({
              variables: { id },
              update(cache, { data }) {
                if (!data?.archiveCall) return;
                const updatedCall = data.archiveCall;
                const existing = cache.readQuery<PaginatedCallsData>({
                  query: GET_CALLS,
                  variables: { offset: 0, limit: 10 },
                });
                if (existing?.paginatedCalls?.nodes) {
                  const newCalls = existing.paginatedCalls.nodes.map((call) =>
                    call.id === updatedCall.id ? updatedCall : call
                  );
                  cache.writeQuery({
                    query: GET_CALLS,
                    variables: { offset: 0, limit: 10 },
                    data: {
                      paginatedCalls: {
                        ...existing.paginatedCalls,
                        nodes: newCalls,
                      },
                    },
                  });
                }
              },
            });
          }
          message.success("Selected calls archived/unarchived successfully");
          setSelectedRowKeys([]);
          refetch();
        } catch (error) {
          console.error(error);
          message.error("Failed to archive/unarchive selected calls");
        }
      },
    });
  };

  if (loading) return <Spin size="large" className="fullscreen-spin" />;

  return (
    <>
      <Header />
      <div className="p-8">
        <div className="avenir-book text-[28px]">Turing Technologies Frontend Test</div>
        <Space className="py-5">
          <span className="avenir-book text-[14px]">Filter by: </span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="avenir-book text-[14px]"
            style={{ width: 180 }}
          >
            <Option value="all">All</Option>
            <Option value="archived">Archived</Option>
            <Option value="unarchived">Unarchived</Option>
          </Select>

          <Button
            type="primary"
            onClick={handleArchiveCalls}
            disabled={selectedRowKeys.length === 0}
          >
            Archive / Unarchive Selected
          </Button>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            current: offset / limit + 1,
            pageSize: limit,
            total: data?.paginatedCalls?.totalCount || 0,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} results`,
            onChange: (page) => setOffset((page - 1) * limit),
            position: ["bottomCenter"],
          }}
        />
      </div>

      <AddNoteModal
        open={isModalOpen}
        onCancel={closeModal}
        onSubmit={handleSaveNote}
        call={selectedCall}
        note={note}
        setNote={setNote}
      />
    </>
  );
}
