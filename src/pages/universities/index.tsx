import React, { useEffect, useState } from "react";
import { useUniversities } from "@/services";
import { Box, Button, HStack, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import Create from "../../components/universities/create";
import Edit from "../../components/universities/edit";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import DeleteModal from "../../components/universities/delete";

export interface UniversitiesProps {
  id: number;
  name: string;
  slug: string;
  action?: VoidFunction;
}

const Universities = () => {
  const { universities, isLoading, isError } = useUniversities();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [editedRow, seteditedRow] = useState({} as Row<UniversitiesProps>);

  const handleEdit = (row: Row<UniversitiesProps>) => {
    seteditedRow(row);
    onEditOpen();
  };

  const handleDelete = (row: Row<UniversitiesProps>) => {
    seteditedRow(row);
    onDeleteOpen();
  };

  const [data, setData] = useState<UniversitiesProps[]>(universities || []);
  useEffect(() => {
    setData(universities || []);
  }, [universities]);

  const columnHelper = createColumnHelper<UniversitiesProps>();
  const columns = [
    columnHelper.accessor("name", {
      header: "University",
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: ({ row }) => (
        <HStack>
          <Button colorScheme="blue" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button colorScheme="red" onClick={() => handleDelete(row)}>
            Delete
          </Button>
        </HStack>
      ),
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      <Button colorScheme="teal" onClick={onCreateOpen}>
        Add new universities
      </Button>

      <Create isOpen={isCreateOpen} onClose={onCreateClose} />
      <Edit
        isOpen={isEditOpen}
        onClose={onEditClose}
        rowData={editedRow}
        setData={setData}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        rowData={editedRow}
        setData={setData}
      />

      <Table bgColor="white" borderRadius="lg" mt={4}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Universities;
