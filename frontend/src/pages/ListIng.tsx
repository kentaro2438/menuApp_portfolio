import '../reset.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllIng, getCat } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import { Pencil } from 'lucide-react';

function ListIng() {
    const [ingData, setIngData] = useState<ingType[]>([]); // 全ての材料
    const [catData, setCatData] = useState<catType[]>([]); // カテゴリー
    const [showCatId, setShowCatId] = useState(""); // 初期状態では全てのカテゴリーを表示
    const [searchWord, setSearchWord] = useState(""); // 検索文字

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    // 全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    // カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };


    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory = showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch = ing.ing_name.includes(searchWord.trim());
        return matchCategory && matchSearch;
    });

    return (
        <div className="main list-ing-page">
            <h2>材料</h2>
            <hr />
            <br />
            <p>登録済みの材料を編集・削除できます</p>
            <div className="input-area">
                <Input
                    word={searchWord}
                    setWord={setSearchWord}
                    placeholder="材料名を検索"
                />
                <Select
                    showCatId={showCatId}
                    setShowCatId={setShowCatId}
                    catData={catData}
                />
                <Link to="/list_ing/add" className='btn btn-main'>材料を追加</Link>
            </div>
            <div className="two-columns-container">
                {filteredIngData.map((ing: ingType) => {
                    const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                    const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                    return (
                        <div key={ing.ing_id} className="card">
                            <p className={`cat-name cat-${catId}`}>{catName}</p>
                            <hr />
                            <div className="inner-wrap">
                                <p className='name'>{ing.ing_name}</p>
                                <div className="btn-container">
                                    <Link
                                        to={`/list_ing/edit/${ing.ing_id}`}
                                        className='btn btn-sub edit'
                                    >
                                        <span className='lucide-icon'>
                                            <Pencil />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ListIng;