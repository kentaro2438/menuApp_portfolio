import '../reset.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIng, getCat, searchDish } from '../api/api.js';
import type { ingType, catType } from "../types/type.ts";
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';
import IngCardCheckboxType from '../components/IngCardCheckboxType.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import { Search as SearchIcon } from 'lucide-react';

function Search() {
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [showCatId, setShowCatId] = useState<string>("");
    const { showNotification } = useNotification();

    const navigate = useNavigate();

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

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    const handleCheckboxChange = (ingId: number) => {
        setSelectedIngIds((prev) => {
            if (prev.includes(ingId)) {
                return prev.filter((id) => id !== ingId);
            }
            return [...prev, ingId];
        });
    };

    const handleSearch = async () => {
        if (selectedIngIds.length === 0) {
            showNotification("error", "材料を1つ以上選択してください");
            return;
        }
        try {
            const data = await searchDish(selectedIngIds);
            navigate("/result", {
                state: {
                    selectedIngIds,
                    resultList: data.result_list,
                },
            });
        } catch (error: any) {
            showNotification("error", error.message);
        }
    };

    const filteredIngData = ingData.filter((ing: ingType) => {
        const matchCategory =
            showCatId === "" || ing.cat_id === Number(showCatId);
        const matchSearch =
            ing.ing_name.includes(searchWord.trim());
        return matchCategory && matchSearch;
    });

    return (
        <div className="main search-page">
            <h2><SearchIcon className='h2-icon' /> 検索</h2>
            <hr />
            <br />
            <p>選択した材料から作れる料理を検索できます．以下の材料リストで材料をチェックしてから，検索ボタンを押してください．</p>
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
                <button onClick={handleSearch}><SearchIcon className='icon-in-main-btn' /> 検索</button>
            </div>
            <p className='card-header'>材料一覧<span className='length'>{filteredIngData.length}</span></p>
            <div className="card-columns-container">
                {filteredIngData
                    .sort((a, b) => a.cat_id - b.cat_id)
                    .map((ing: ingType) => (
                        <IngCardCheckboxType
                            key={ing.ing_id}
                            ing={ing}
                            catData={catData}
                            selectedIngIds={selectedIngIds}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Search;