import '../reset.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCat, getAllIng, getDish, editDish } from "../api/api.js";
import type { catType, ingType } from "../types/type.ts";
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

function EditDish() {
    const { dish_id } = useParams<{ dish_id: string }>();
    const [dishName, setDishName] = useState<string>("");
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [showCatId, setShowCatId] = useState<string>("");

    useEffect(() => {
        fetchGetAllIng();
        fetchGetCategory();
        fetchGetDish();
    }, []);

    const fetchGetAllIng = async () => {
        const data = await getAllIng();
        setIngData(data.ing_list);
    };

    const fetchGetCategory = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
    };

    const fetchGetDish = async () => {
        const data = await getDish(Number(dish_id));
        setDishName(data.dish_name);
        setSelectedIngIds(data.ing_id_needed_list);
    };

    const handleCheckboxChange = (ingId: number) => {
        setSelectedIngIds((prev) => {
            if (prev.includes(ingId)) {
                return prev.filter((id) => id !== ingId);
            }
            return [...prev, ingId];
        });
    };

    const handleEditDish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedDishName = dishName.trim();

        if (!trimmedDishName) {
            setError("料理名を入力してください");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        if (selectedIngIds.length === 0) {
            setError("材料を1つ以上選択してください");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        try {
            await editDish(Number(dish_id), trimmedDishName, selectedIngIds);
            setSuccessMessage("料理が正常に編集されました。");
        } catch (error: any) {
            setError(`エラー: ${error.message}`);
            return;
        } finally {
            setTimeout(() => {
                setSuccessMessage("");
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
            <h2>料理を編集</h2>

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

            <form onSubmit={handleEditDish}>
                <div>
                    <label htmlFor="dishName">料理名</label>
                    <input
                        id="dishName"
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="料理名を入力"
                    />
                </div>

                <div>
                    {filteredIngData.map((ing: ingType) => {
                        const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
                        const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;

                        return (
                            <div key={ing.ing_id} className="card">
                                <p className={`cat-name cat-${catId}`}>{catName}</p>
                                <hr />
                                <div className="inner-wrap">
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

                <button type="submit">更新</button>
            </form>

            <div className="message">
                {successMessage && <p>{successMessage}</p>}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default EditDish;