import Root from "./Root";
import Header from "./Header";
import Body from "./Body";
import Row from "./Row";
import Head from "./Head";
import Cell from "./Cell";
import Footer from "./Footer";
import Caption from "./Caption";

// Attach properties to Root for namespace access (e.g. Table.Header)
type TableType = typeof Root & {
    Header: typeof Header;
    Body: typeof Body;
    Row: typeof Row;
    Head: typeof Head;
    Cell: typeof Cell;
    Footer: typeof Footer;
    Caption: typeof Caption;
};

export const Table = Root as TableType;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;
Table.Footer = Footer;
Table.Caption = Caption;

export default Table;
export { Root, Header, Body, Row, Head, Cell, Footer, Caption };
export { Header as TableHeader, Body as TableBody, Row as TableRow, Head as TableHead, Cell as TableCell, Footer as TableFooter, Caption as TableCaption };
