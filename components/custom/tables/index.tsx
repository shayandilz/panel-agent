import React, {ReactNode} from "react";

// Props for Table
interface TableProps {
    children: ReactNode; // Table content (thead, tbody, etc.)
    className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
    children: ReactNode; // Header row(s)
    className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
    children: ReactNode; // Body row(s)
    className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
    children: ReactNode; // Cells (th or td)
    className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
    children: ReactNode; // Cell content
    isHeader?: boolean; // If true, renders as <th>, otherwise <td>
    className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({children, className = ''}) => {
    return <table className={`min-w-full table-auto border-collapse text-center ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({children, className = ''}) => {
    return <thead className={`${className} bg-orange-400 dark:bg-brand-900 dark:text-white`}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({children, className = ''}) => {
    return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({children, className = ''}) => {
    return <tr className={`${className} even:bg-orange-50 hover:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.05] dark:even:bg-blue-500/[0.08]`}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
                                                 children,
                                                 isHeader = false,
                                                 className = '',
                                             }) => {
    const CellTag = isHeader ? "th" : "td";
    return <CellTag
        className={`${isHeader ? 'py-4 text-nowrap' : 'border-t border-gray-30 dark:border-gray-800'} px-2 py-3 ${className}`}>{isHeader ? children : (children || '-' )}</CellTag>;
};

export {Table, TableHeader, TableBody, TableRow, TableCell};
