import Root from "./Table/Root";
import Header from "./Table/Header";
import Body from "./Table/Body";
import Row from "./Table/Row";
import Head from "./Table/Head";
import Cell from "./Table/Cell";
import Footer from "./Table/Footer";
import Caption from "./Table/Caption";

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
