//css
import '../reset.css';
//react
import { useEffect, useState } from "react";
//api
import { getAllIng, getCat } from '../api/api.js';
//types
import type { ingType, catType } from '../types/type.ts';
//components
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
//context
import { Link } from "react-router-dom";
//icons
import { Apple, Plus } from 'lucide-react';
import EditIcon from '../img/Edit.svg';


function ListIng() {
    const [ingData, setIngData] = useState<ingType[]>([]); 
    const [catData, setCatData] = useState<catType[]>([]); 
    const [showCatId, setShowCatId] = useState(""); 
    const [searchWord, setSearchWord] = useState(""); 
    const [firstLoading, setFirstLoading] = useState<boolean>(false);


    //ローディング表示
    useEffect(() => {
        const firstFetch = async () => {
            setFirstLoading(true);
            await fetchGetAllIng();
            await fetchGetCat();
            setFirstLoading(false);
        };
        firstFetch();
    }, []);

    if (firstLoading) {
        return <LoadingSpinner />;
    }

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
            <h2><Apple className='h2-icon' />材料</h2>
            <hr />
            <div className="contents-area">
                <p>登録済みの材料を確認できます</p>
                <div className="input-area">
                    <div className="input-area-for-mb">
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
                    </div>
                    <Link to="/list_ing/add" className='btn to-add-ing-btn'><Plus className='icon-in-btn' />材料を追加</Link>
                </div>
                <section className='ing-list'>
                    <div className='card-header'>
                        すべての材料
                        <span className='length'>{filteredIngData.length}</span>
                        <span className='icon-hint'>
                            <img src={EditIcon} alt="編集" />
                            材料を編集
                        </span>
                    </div>
                    <div className="card-columns-container">
                        {filteredIngData
                            .sort((a, b) => a.cat_id - b.cat_id)
                            .map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <div key={ing.ing_id} className="card">
                                        <div className='card-row'>
                                            <p className='name'>
                                                {ing.ing_name}
                                            </p>
                                            <div className='card-right'>
                                                <span className={`cat-name cat-${catId}`}>
                                                    {catName}
                                                </span>
                                                <Link
                                                    to={`/list_ing/edit/${ing.ing_id}`}
                                                    className='icon-btn'
                                                >
                                                    <img src={EditIcon} alt="Edit" className='icon edit' />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ListIng;