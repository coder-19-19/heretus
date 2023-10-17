import {Pagination, PaginationItem, PaginationLink} from "reactstrap";
import paginationCounts from '../../data/paginationCounts.json'
import Select from "react-select";
import {usePagination} from "./usePagination";

const CustomPagination = ({total, limit = 10, setLimit, page, setPage}) => {
    const paginationCount = Math.ceil(total / limit)

    const paginationRange = usePagination({
        totalCount: total,
        pageSize: limit,
        currentPage: page,
        siblingCount: 1
    })

    return total > 0 && <div className="d-flex justify-content-end w-100 mt-2">
        <div className="d-flex gap-2 align-items-start">
            {setLimit && (
                <Select
                    options={paginationCounts}
                    value={paginationCounts.find(item => item.value === limit)}
                    onChange={e => setLimit(e.value)}
                />
            )}
            <Pagination>
                <PaginationItem disabled={page === 1} onClick={() => {
                    page !== 1 && setPage(prev => prev - 1)
                }
                }>
                    <PaginationLink>
                        <i className="bx bx-left-arrow-alt"/>
                    </PaginationLink>
                </PaginationItem>
                {paginationRange.map((item) => (
                    item === '...' ? (
                        <PaginationItem>
                            <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                    ) : (
                        <PaginationItem onClick={() => setPage(item)} key={item} active={page === item}>
                            <PaginationLink>{item}</PaginationLink>
                        </PaginationItem>
                    )
                ))}
                <PaginationItem disabled={paginationCount === page} onClick={() => {
                    paginationCount !== page && setPage(prev => prev + 1)
                }
                }>
                    <PaginationLink>
                        <i className="bx bx-right-arrow-alt"/>
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        </div>
    </div>
}

export default CustomPagination
