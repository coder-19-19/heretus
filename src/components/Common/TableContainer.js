import React, {Fragment, memo, useEffect} from "react";
import PropTypes from "prop-types";
import {useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable} from "react-table";
import {Table} from "reactstrap";
import {DefaultColumnFilter, Filter} from "./filters";

const TableContainer = ({
                            columns,
                            data,
                            customPageSize,
                            className,
                            setSelectedRows

                        }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        setPageSize,
        selectedFlatRows
    } = useTable(
        {
            columns,
            data,
            defaultColumn: {Filter: DefaultColumnFilter},
            initialState: {
                pageIndex: 0,
                pageSize: customPageSize,
                sortBy: [
                    {
                        desc: true,
                    },
                ],
            },
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect,
        (hooks) => {
            setSelectedRows ?
                hooks.visibleColumns.push((columns) => [
                    {
                        id: 'selection',
                        Header: ({getToggleAllRowsSelectedProps}) => (
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input" {...getToggleAllRowsSelectedProps()} />
                            </div>
                        ),
                        Cell: ({row}) => (
                            <div className="form-check mb-3">
                                <input type="checkbox"
                                       className="form-check-input" {...row.getToggleRowSelectedProps()} />
                            </div>
                        ),
                    },
                    ...columns,
                ]) : null
        }
    );

    const selectedRows = selectedFlatRows.map((row) => row.original);
    const generateSortingIndicator = column => {
        return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
    };

    useEffect(() => {
        setSelectedRows && setSelectedRows(selectedRows)
    }, [selectedFlatRows])

    return (
        <Fragment>
            {/*<Row className="mb-2">*/}
            {/*  <Col md={customPageSizeOptions ? 2 : 1}>*/}
            {/*    <select*/}
            {/*        className="form-select"*/}
            {/*        value={pageSize}*/}
            {/*        onChange={onChangeInSelect}*/}
            {/*    >*/}
            {/*      {[10, 20, 30, 40, 50].map(pageSize => (*/}
            {/*          <option key={pageSize} value={pageSize}>*/}
            {/*            Show {pageSize}*/}
            {/*          </option>*/}
            {/*      ))}*/}
            {/*    </select>*/}
            {/*  </Col>*/}
            {/*  {isGlobalFilter && (*/}
            {/*      <GlobalFilter*/}
            {/*          preGlobalFilteredRows={preGlobalFilteredRows}*/}
            {/*          globalFilter={state.globalFilter}*/}
            {/*          setGlobalFilter={setGlobalFilter}*/}
            {/*          isJobListGlobalFilter={isJobListGlobalFilter}*/}
            {/*      />*/}
            {/*  )}*/}
            {/*</Row>*/}

            <div className="table-responsive react-table">
                <Table bordered showPaginationBottom={false} hover {...getTableProps()} className={className}>
                    <thead className="table-light table-nowrap">
                    {headerGroups.map(headerGroup => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th key={column.id}>
                                    <div className="mb-2" {...column.getSortByToggleProps()}>
                                        {column.render("Header")}
                                        {generateSortingIndicator(column)}
                                    </div>
                                    <Filter column={column}/>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <Fragment key={row.getRowProps().key}>
                                <tr>
                                    {row.cells.map(cell => {
                                        return (
                                            <td key={cell.id} {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </Fragment>
                        );
                    })}
                    </tbody>
                </Table>
            </div>

            {/*<Row className="justify-content-md-end justify-content-center align-items-center">*/}
            {/*    <Col className="col-md-auto">*/}
            {/*        <div className="d-flex gap-1">*/}
            {/*            <Button*/}
            {/*                color="primary"*/}
            {/*                onClick={() => gotoPage(0)}*/}
            {/*                disabled={!canPreviousPage}*/}
            {/*            >*/}
            {/*                {"<<"}*/}
            {/*            </Button>*/}
            {/*            <Button*/}
            {/*                color="primary"*/}
            {/*                onClick={previousPage}*/}
            {/*                disabled={!canPreviousPage}*/}
            {/*            >*/}
            {/*                {"<"}*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*    <Col className="col-md-auto d-none d-md-block">*/}
            {/*        Page{" "}*/}
            {/*        <strong>*/}
            {/*            {pageIndex + 1} of {pageOptions.length}*/}
            {/*        </strong>*/}
            {/*    </Col>*/}
            {/*    <Col className="col-md-auto">*/}
            {/*        <Input*/}
            {/*            type="number"*/}
            {/*            min={1}*/}
            {/*            style={{width: 70}}*/}
            {/*            max={pageOptions.length}*/}
            {/*            defaultValue={pageIndex + 1}*/}
            {/*            onChange={onChangeInInput}*/}
            {/*        />*/}
            {/*    </Col>*/}

            {/*    <Col className="col-md-auto">*/}
            {/*        <div className="d-flex gap-1">*/}
            {/*            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>*/}
            {/*                {">"}*/}
            {/*            </Button>*/}
            {/*            <Button*/}
            {/*                color="primary"*/}
            {/*                onClick={() => gotoPage(pageCount - 1)}*/}
            {/*                disabled={!canNextPage}*/}
            {/*            >*/}
            {/*                {">>"}*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </Fragment>
    );
};

TableContainer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default memo(TableContainer);
