import '../reset.css';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllIng, getCat } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';

function ListIng() {
    const [ingData, setIngData] = useState<ingType[]>([]); //全ての材料
    const [catData, setCatData] = useState<catType[]>([]); //カテゴリー

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    //全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list);
    };

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
    };


    return (
        <div className="main">
            <h2>材料一覧</h2>
            <Link to="/list_ing/add">材料を追加</Link>
            <div className="card-container">
                {catData.map((cat: catType) => (
                    <div key={cat.cat_id} className='card'>
                        <h3>{cat.cat_name}</h3>
                        <div className="grid-container">
                            {ingData.filter((ing: ingType) => ing.cat_id === cat.cat_id).map((ing: ingType) => (
                                <Link key={ing.ing_id} to={`/list_ing/edit/${ing.ing_id}`}>
                                    {ing.ing_name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ListIng;