import DataTable from 'react-data-table-component';

const CommonTable = ({ title, columns, data, loading, totalRows, onPageChange }) => {
  return (
    <DataTable
      title={title}
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={onPageChange}
    />
  );
};

export default CommonTable;