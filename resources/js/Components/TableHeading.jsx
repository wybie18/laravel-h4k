import { HiChevronDown, HiChevronUp  } from "react-icons/hi";

export default function TableHeading({name, sortable=true, sort_field = null, sort_direction = null, sortChange = () => {}, children}){
    return(
        <th onClick={e => sortChange(name)}>
            <div className="px-3 py-2 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable ? 
                    <div className="flex flex-col text-gray-400">
                        <HiChevronUp className={sort_field === name && sort_direction === "asc" ? "text-gray-800" : ""} />
                        <HiChevronDown className={sort_field === name && sort_direction === "desc" ? "text-gray-800" : ""} />
                    </div> : ""
                }
            </div>
        </th>
    )
}