import React from 'react'
import useQueryupdate from "../../../services/useQueryupdate";
import QuerygetSpacficIteam from "../../../services/QuerygetSpacficIteam";
import { useParams } from 'react-router-dom';

const EditSuplier = () => {
    const {id}= useParams()
    const {data , isError , isLoading:loadingGet} = QuerygetSpacficIteam("supliers", "supliers")
    const {isLoading , updateiteam} = useQueryupdate("supliers" , "supliers")
  return (
    <div>EditSuplier</div>
  )
}

export default EditSuplier