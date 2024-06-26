import { Model } from "@jimmodel/shared";
import {
  ColumnDef,

} from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import placeholderImage from "@assets/placeholder.jpeg";
import DataTable from "./data-table";



export const getColumns = ({onRemoveModel}: {onRemoveModel: (model: Model) => void}) :  ColumnDef<Model>[] => {
    return [
 
        {
          id: "name",
          header: "Name",
          cell: ({ row }) =>
          <div className="flex items-center">
                <Avatar>
                      <AvatarImage className="object-cover" src={row.original.images?.[0]?.url || placeholderImage}/>
                  </Avatar>
                  <p className="ml-3">  {`${row.original.name}`}</p>
          </div>
        ,
          
        },
        {
          accessorKey: "email",
          header: "Email"
        },
        {
          id: "action",
          cell: ({ row }) => (
              <Button onClick={() => onRemoveModel(row.original)} size={"sm"} variant={"outline"}>Remove</Button>
          )
        }
      ]; 

} 




function ModelTable({models, onRemoveModel}: {models: Model[], onRemoveModel: (model: Model) => void}){
    return (
        <div>
            <DataTable columns={getColumns({onRemoveModel})} data={models} />
        </div>
    )
}

export default ModelTable