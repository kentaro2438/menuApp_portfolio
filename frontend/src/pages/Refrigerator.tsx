//css
import '../reset.css';
//react
import { useEffect, useState } from "react";
//api
import { getAllIng, getCat, getRefIng, addIngToRef, deleteIngFromRef, searchDish } from '../api/api.js';
//api
import type { ingType, catType, refIngType } from '../types/type.ts';
//components
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import RefCard from '../components/RefCard.tsx';
//context
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from "react-router-dom";
//icon
import { Refrigerator as RefrigeratorIcon, SearchIcon } from 'lucide-react';
import PlusIcon from '../img/Plus.svg';
import DeleteIcon from '../img/Delete.svg';


function Refrigerator() {

    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [showCatId, setShowCatId] = useState("");
    const [searchWord, setSearchWord] = useState("");
    const [isOpenRef, setIsOpenRef] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [refIngData, setRefIngData] = useState<refIngType[]>([]);
    const refIngIdSet = new Set(refIngData.map(ing => ing.ing_id));
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    //ローディング表示  
    useEffect(() => {
        const firstFetch = async () => {
            setFirstLoading(true);
            await fetchGetAllIng();
            await fetchGetCat();
            await fetchGetRefIng();
            setFirstLoading(false);
        };
        firstFetch();
    }, []);

    //画面サイズの変更を監視してisMobileを更新
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (firstLoading) {
        return <LoadingSpinner />;
    }

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

    const filteredRefIngData = refIngData.filter((ing: refIngType) => {
        const matchCategory = showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch = ing.ing_name.includes(searchWord.trim());
        return matchCategory && matchSearch;
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
        setLoading(true);
        const refIngIds = refIngData.map(ing => ing.ing_id);
        if (refIngIds.length === 0) {
            showNotification("error", "冷蔵庫に材料がありません");
            setLoading(false);
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main refrigerator-page">
            <h2><RefrigeratorIcon className='h2-icon' />冷蔵庫</h2>
            <hr />
            <div className="contents-area">
                <p>冷蔵庫の材料を管理できます</p>
                <div className="input-area">
                    <div className='input-area-for-mb'>
                        <Input
                            word={searchWord}
                            setWord={setSearchWord}
                            placeholder="材料を検索"
                        />
                        <Select
                            showCatId={showCatId}
                            setShowCatId={setShowCatId}
                            catData={catData}
                        />
                    </div>
                    <button onClick={handleSearch} disabled={loading}
                        className='btn search-from-ref-btn'>
                        <SearchIcon className='icon-in-btn' />
                        {loading ? "検索中..." : "冷蔵庫の材料から料理を検索"}
                    </button>
                </div>
                <div className="tabs">
                    <button
                        className={!isOpenRef ? "tab active not-in-ref" : "tab"}
                        onClick={() => setIsOpenRef(false)}
                    >
                        冷蔵庫にない材料
                    </button>
                    <button
                        className={isOpenRef ? "tab active in-ref" : "tab"}
                        onClick={() => setIsOpenRef(true)}
                    >
                        冷蔵庫にある材料
                    </button>
                </div>
                <div className='two-columns-container'>
                    <div className={
                        isMobile
                            ? (isOpenRef ? 'not-in-ref hidden' : 'not-in-ref')
                            : 'not-in-ref'
                    }>
                        <section className="ing-list">
                            <div className='card-header'>
                                冷蔵庫にない材料
                                <span className='length'>{filteredIngData.length}</span>
                                <span className='icon-hint'>
                                    <img src={PlusIcon} alt="編集" />
                                    冷蔵庫に追加
                                </span>
                            </div>
                            <div className="ref-columns-container">
                                {filteredIngData
                                    .sort((a, b) => a.cat_id - b.cat_id)
                                    .map((ing: ingType) => {
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
                        </section>
                    </div>
                    <div className={isMobile
                        ? (isOpenRef ? 'in-ref' : 'in-ref hidden')
                        : 'in-ref'
                    }>
                        <section className="ref-list yellow">
                            <div className='card-header yellow'>
                                冷蔵庫の材料
                                <span className='length'>{filteredRefIngData.length}</span>
                                <span className='icon-hint'>
                                    <img src={DeleteIcon} alt="削除" />
                                    冷蔵庫から削除
                                </span>
                            </div>
                            <div className="ref-columns-container">
                                {filteredRefIngData
                                    .sort((a, b) => {
                                        return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
                                    }).map((ing: ingType) => {
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
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Refrigerator;