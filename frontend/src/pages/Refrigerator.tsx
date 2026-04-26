import '../reset.css';
import { useEffect, useState } from "react";
import { getAllIng, getCat, getRefIng, addIngToRef, deleteIngFromRef, searchDish } from '../api/api.js';
import type { ingType, catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import RefCard from '../components/RefCard.tsx';
import { useNavigate } from "react-router-dom";
import { Refrigerator as RefrigeratorIcon, SearchIcon } from 'lucide-react';


function Refrigerator() {

    const [ingData, setIngData] = useState<ingType[]>([]); //全ての材料
    const [catData, setCatData] = useState<catType[]>([]); //カテゴリー
    const [showCatId, setShowCatId] = useState(""); //初期状態では全てのカテゴリーを表示
    const [searchWord, setSearchWord] = useState(""); //検索文字
    const [refIngData, setRefIngData] = useState<ingType[]>([]); //冷蔵庫の材料
    const refIngIdSet = new Set(refIngData.map(ing => ing.ing_id)); //冷蔵庫の材料IDのセット（重複なし）
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
        fetchGetRefIng();
    }, []);

    //全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list_json);
    };

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list_json);
    };

    //検索とカテゴリー絞り込み
    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory = showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch = ing.ing_name.includes(searchWord.trim());
        const notInRef = !refIngIdSet.has(ing.ing_id); //冷蔵庫にない材料のみ表示
        return matchCategory && matchSearch && notInRef;
    });

    //冷蔵庫の材料を取得
    const fetchGetRefIng = async () => {
        const data = await getRefIng();
        setRefIngData(data.ings_in_ref_list_json);
    };

    //冷蔵庫に材料を追加
    const handleAddIngToRef = async (ing_id: number) => {
        try {
            await addIngToRef(ing_id);
            showNotification("success", "材料が冷蔵庫に追加されました");
            fetchGetRefIng();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    //冷蔵庫から材料を削除
    const handleDeleteIngFromRef = async (ing_id: number) => {
        try {
            await deleteIngFromRef(ing_id);
            showNotification("success", "材料が冷蔵庫から削除されました");
            fetchGetRefIng();
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    }

    //冷蔵庫にある材料で作れる料理を検索
    const handleSearch = async () => {
        const refIngIds = refIngData.map(ing => ing.ing_id);
        if (refIngIds.length === 0) {
            showNotification("error", "冷蔵庫に材料がありません");
            return;
        }
        try {
            const data = await searchDish(refIngIds);
            navigate("/result", {
                state: {
                    selectedIngIds: refIngIds,
                    resultList: data.result_list,
                },
            });
        } catch (error: any) {
            showNotification("error", error.message);
        }
    }

    return (
        <div className="main refrigerator-page">
            <h2><RefrigeratorIcon className='h2-icon' /> 冷蔵庫</h2>
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
                <button onClick={handleSearch}
                    className='ref-search-btn'>
                    <SearchIcon className='icon-in-main-btn' />
                    冷蔵庫の材料で作れる料理を検索
                </button>
            </div>
            <div className='two-columns-container'>
                <div>
                    <p className='ref-name'>冷蔵庫にない材料<span className='length'>{filteredIngData.length}</span></p>
                    <div className="ref-columns-container">
                            {filteredIngData.map((ing: ingType) => {
                                const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                                const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                                return (
                                    <RefCard
                                        key={ing.ing_id}
                                        ing={ing}
                                        catId={catId}
                                        catName={catName}
                                        type="add"
                                        onClick={handleAddIngToRef}
                                    />
                                )
                            })}
                    </div>
                </div>
                <div>
                    <p className='ref-name'>冷蔵庫にある材料<span className='length'>{refIngData.length}</span></p>
                    <div className="ref-columns-container">
                        {refIngData.map((ing: ingType) => {
                            const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                            const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                            return (
                                <RefCard
                                    key={ing.ing_id}
                                    ing={ing}
                                    catId={catId}
                                    catName={catName}
                                    type="delete"
                                    onClick={handleDeleteIngFromRef}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Refrigerator;