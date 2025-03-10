import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CollectionItem from "./components/CollectionItem";
import GlobalCollection from "./components/GlobalCollection";
import { useState } from "react";
import { FilterFunc } from "../../type/view/outline/type";
import { useOSMMapStore } from "../../store/osmmeta";

function OutlineView({ width, height }: { width: number, height: number }) {
    const { ptv2, highway, created } = useOSMMapStore((state) => state.collections)
    const [searchTerm, setSearchTerm] = useState("");
    const searchFilter: FilterFunc = (meta, type) =>
        searchTerm === "" || `${type}-${JSON.stringify(meta)}`.includes(searchTerm)


    return (
        <div style={{ width, height, maxWidth: width, maxHeight: height }} className="outline-view flex flex-col p-1 rounded bg-base-100 overflow-x-scroll">
            <label className="input input-xs input-bordered flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} />
                <input
                    type="text"
                    className="grow"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </label>
            <div className="outline-list flex-1 overflow-scroll mt-1 rounded">
                <ul className="menu menu-xs bg-base-200">
                    <CollectionItem name="Public Transport" collecion={ptv2} filterFun={searchFilter} />
                    <CollectionItem name="Highway" collecion={highway} filterFun={searchFilter} />
                    <CollectionItem name="Created" collecion={created} filterFun={searchFilter} />
                    <GlobalCollection name="Global" filterFun={searchFilter} />
                </ul>
            </div>
        </div>
    );
}

export default OutlineView;
