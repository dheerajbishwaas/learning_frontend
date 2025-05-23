import DataTable from 'react-data-table-component';

const CommonTable = ({
  title,
  columns,
  data,
  loading,
  totalRows,
  onPageChange,
  perPage,
  onRowsPerPageChange
}) => {
  return (
    <DataTable
      title={title}
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationPerPage={perPage}          // pass perPage to control rows per page
      onChangePage={onPageChange}
      onChangeRowsPerPage={onRowsPerPageChange}  // handle rows per page change event
    />
  );
};

export default CommonTable;