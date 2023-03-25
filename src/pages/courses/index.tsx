import { useState } from 'react';
import { useCourses, useUniversities } from '@/services';
import { Box, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { CourseRowProps } from '@/interfaces';
import Link from 'next/link';
import { Create, DeleteModal } from '@/components/courses';

const Courses = () => {
  const { courses } = useCourses();
  const { universities } = useUniversities();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [editedRow, seteditedRow] = useState({} as Row<CourseRowProps>);

  const handleDelete = (row: Row<CourseRowProps>) => {
    seteditedRow(row);
    onDeleteOpen();
  };

  const columnHelper = createColumnHelper<CourseRowProps>();
  const columns = [
    columnHelper.accessor('institution_name', {
      header: 'Univ Name',
    }),
    columnHelper.accessor('course_id', {
      header: 'Course Id',
    }),
    columnHelper.accessor('course_name', {
      header: 'Course Name',
    }),

    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <HStack>
          <Link
            href={{
              pathname: `/courses/${row.original.id}/edit`,
              query: {
                // name: row.original.name,
                // institutionId: row.original.institutionId,
                // institutionName: row.original.institutionName,
              },
            }}
            passHref
            legacyBehavior
          >
            <Button colorScheme="blue">Edit</Button>
          </Link>
          <Button colorScheme="red" onClick={() => handleDelete(row)}>
            Delete
          </Button>
        </HStack>
      ),
    }),
  ];
  const table = useReactTable({
    data: courses || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box>
      <Button colorScheme="teal" onClick={onCreateOpen}>
        Tambahkan mata kuliah
      </Button>

      <Create
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        // setData={setData}
        universities={universities}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        rowData={editedRow}
        // setData={setData}
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

export default Courses;
