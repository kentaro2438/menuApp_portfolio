import '../reset.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCat, getAllIng, getDish, editDish } from "../api/api.js";
import type { catType, ingType } from "../types/type.ts";


function EditDish() {
    const { dish_id } = useParams<{ dish_id: string }>();
    const [dishName, setDishName] = useState<string>("");
    const [selectedIngIds, setSelectedIngIds] = useState<number[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [ingData, setIngData] = useState<ingType[]>([]);
    const [catData, setCatData] = useState<catType[]>([]);

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
        return data;
    };

    const handleCheckboxChange = (ingId: number) => {
        setSelectedIngIds((prev) => {
            if (prev.includes(ingId)) {
                return prev.filter((id) => id !== ingId);
            }
            return [...prev, ingId];
        });
    };

    const handleEditDish = async (e: any) => {
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
            setDishName("");
            setSelectedIngIds([]);
            setSuccessMessage("料理が正常に編集されました。");
        } catch (error: any) {
            setError(`エラー: ${error.message}`);
        } finally {
            setTimeout(() => {
                setSuccessMessage("");
                setError("");
            }, 2000);
        }
    };


    return (
        <div className="main">
            <h2>料理を編集</h2>
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
                <div className="cat-card-container">
                    {catData.map((cat) => (
                        <div key={cat.cat_id} className="cat-card">
                            <h3>{cat.cat_name}</h3>
                            <div className="grid-container">
                                {ingData
                                    .filter((ing) => ing.cat_id === cat.cat_id)
                                    .map((ing) => (
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
                <button type="submit">編集</button>
            </form>
            <div className="message">
                {successMessage && <p>{successMessage}</p>}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default EditDish;