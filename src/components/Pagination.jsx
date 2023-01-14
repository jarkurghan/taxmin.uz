import * as React from 'react';
import { styled } from '@mui/system';
import TablePaginationUnstyled, {
    tablePaginationUnstyledClasses as classes,
} from '@mui/base/TablePaginationUnstyled';

function createData(orin, nomi, gol, otkazibyuborilgan, galaba, durang, maglubiyat, status, profile_id) {
    return { orin, nomi, gol, otkazibyuborilgan, galaba, durang, maglubiyat, status, profile_id };
}

const rows = [
    createData(1, "Gerta", 6, 1, 3, 0, 0, 0, "12345678"),
    createData(2, "Borussiya", 7, 7, 2, 0, 1, 0, "12345678"),
    createData(3, "Bayer", 6, 8, 2, 0, 1, 0, "12345678"),
    createData(4, "Leypzig", 6, 3, 1, 1, 1, 0, "12345678"),
    createData(5, "Hoffenhaym", 6, 3, 1, 1, 1, 0, "12345678"),
    createData(6, "Verder", 4, 3, 1, 1, 1, 0, "12345678"),
    createData(7, "Shalke 04", 2, 4, 0, 1, 2, 0, "12345678"),
    createData(8, "Bavariya", 4, 12, 0, 0, 3, 0, "12345678"),
    createData(9, "Verona", 4, 12, 0, 0, 3, 0, "12345678"),
    createData(10, "Verona", 4, 12, 0, 0, 3, 0, "12345678"),
    createData(11, "Verona", 4, 12, 0, 0, 3, 0, "12345678"),
].sort((a, b) => (a.orin < b.orin ? -1 : 1));
const blue = {
    200: '#A5D8FF',
    400: '#3399FF',
  };
  
  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  };
  
  const Root = styled('div')(
    ({ theme }) => `
    table {
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      width: 100%;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      box-shadow: 0px 4px 30px ${
        theme.palette.mode === 'dark' ? grey[900] : grey[200]
      };
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      @media (min-width: 780px) {
          overflow-x: auto !important;
      }
    }
  
    td,
    th {
      padding: 16px;
      white-space: nowrap;
    }
  
    th {
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    }
    `,
  );
  
  const CustomTablePagination = styled(TablePaginationUnstyled)(
    ({ theme }) => `
    & .${classes.spacer} {
      display: none;
    }
  
    & .${classes.toolbar}  {
      display: flex;
      justify-content: space-between;
      align-items: flex-center;
      gap: 10px;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    }
  
    & .${classes.selectLabel} {
      margin: 0;
    }
  
    & .${classes.select}{
      padding: 2px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      border-radius: 50px;
      background-color: transparent;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  
      &:hover {
        background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      }
  
      &:focus {
        outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      }
    }
  
    & .${classes.displayedRows} {
      margin: 0;
      margin-left: auto;
    }
  
    & .${classes.actions} {
      padding: 2px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      border-radius: 50px;
      text-align: center;
    }
  
    & .${classes.actions} > button {
      margin: 0 8px;
      border: transparent;
      border-radius: 2px;
      background-color: transparent;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  
      &:hover {
        background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      }
  
      &:focus {
        outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      }
    }
    `,
  );

export default function Table() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Root className='w-100 mt-4 table-responsive'>
            <table className="table table-hover" aria-label="custom pagination table">
                <thead>
                    <tr className=''>
                        <th scope="col">O'rin</th>
                        <th scope="col">Nomi</th>
                        <th scope="col">Go'l</th>
                        <th scope="col">O'tkazib Yuborilgan</th>
                        <th scope="col">G'alaba</th>
                        <th scope="col">Durang</th>
                        <th scope="col">Mag'lubiyat</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <tr key={row.orin}>
                            <td>{row.orin}</td>
                            <td>{row.nomi}</td>
                            <td>{row.gol}</td>
                            <td>{row.otkazibyuborilgan}</td>
                            <td>{row.galaba}</td>
                            <td>{row.durang}</td>
                            <td>{row.maglubiyat}</td>
                            <td>{row.status}</td>
                        </tr>
                    ))}

                    {emptyRows > 0 && (
                        <tr style={{ height: 41 * emptyRows }}>
                            <td colSpan={8} />
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <CustomTablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={8}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    'aria-label': 'rows per page',
                                },
                                actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>
                </tfoot>
            </table>
        </Root>
    );
}