import '../reset.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIng, getCat, searchDish } from '../api/api.js';
import type { ingType, catType } from "../types/type.ts";
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

function Search() {
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [error, setError] = useState<string>("");
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [showCatId, setShowCatId] = useState<string>("");

    const navigate = useNavigate();

    // 全ての材料を取得
    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list);
    };

    // カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
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

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedIngIds.length === 0) {
            setError("材料を1つ以上選択してください");
            setTimeout(() => {
                setError('');
            }, 2000);
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
            setError(error.message || "検索中にエラーが発生しました");
        } finally {
            setTimeout(() => {
                setError("");
            }, 2000);
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
        <div className="main">
            <h2>料理を検索</h2>

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

            <form onSubmit={handleSearch}>
                <div>
                    {filteredIngData.map((ing: ingType) => {
                        const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                        const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
                        return (
                            <div key={ing.ing_id} className="card">
                                <p className={`cat-name cat-${catId}`}>{catName}</p>
                                <hr />
                                <div className='inner-wrap'>
                                    <p className='ing-name'>{ing.ing_name}</p>
                                    <input
                                        type="checkbox"
                                        checked={selectedIngIds.includes(ing.ing_id)}
                                        onChange={() => handleCheckboxChange(ing.ing_id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button type="submit">検索</button>
            </form>

            {error && <p className='error-message'>{error}</p>}
        </div>
    );
}

export default Search;