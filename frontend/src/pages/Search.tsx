import '../reset.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIng, getCat, searchDish } from '../api/api.js';
import type { ingType, catType } from "../types/type.ts";

function Search() {
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [error, setError] = useState<string>("");
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);

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

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCat();
    }, []);

    const navigate = useNavigate();

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


    return (
        <div className="main">
            <h2>料理を検索</h2>
            <form onSubmit={handleSearch}>
                <div className='card-container'>
                    {catData.map((cat: catType) => (
                        <div key={cat.cat_id} className='card'>
                            <h3>{cat.cat_name}</h3>
                            <div className='grid-container'>
                                {ingData
                                    .filter((ing: ingType) => ing.cat_id === cat.cat_id)
                                    .map((ing: ingType) => (
                                        <label key={ing.ing_id} style={{ display: "block" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIngIds.includes(ing.ing_id)}
                                                onChange={() => handleCheckboxChange(ing.ing_id)}
                                            />
                                            {ing.ing_name}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit">検索</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Search;