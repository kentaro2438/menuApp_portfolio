import '../reset.css';
import { useState, useEffect } from 'react';
import { getCat, addIng } from '../api/api.js';
import type { catType } from '../types/type.ts';

function AddIng() {
    const [catData, setCatData] = useState<catType[]>([]); //カテゴリー
    const [newIngName, setNewIngName] = useState<string>(''); //新しい材料名
    const [newIngCat, setNewIngCat] = useState<string>(''); //新しい材料のカテゴリーID
    const [successMessage, setSuccessMessage] = useState<string>(''); //成功メッセージ
    const [error, setError] = useState<string>(''); //エラーメッセージ

    useEffect(() => {
        fetchGetCat();
    }, []);

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
    };

    const handleNewIng = async (e: any) => {
        e.preventDefault();
        const trimmednewIngName = newIngName.trim();
        if (!trimmednewIngName) {
            setError('材料名を入力してください');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        if (!newIngCat) {
            setError('カテゴリーを選択してください');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        try {
            await addIng(trimmednewIngName, parseInt(newIngCat));
            setSuccessMessage('材料が追加されました');
            setNewIngName('');
            setNewIngCat('');
        } catch (error: any) {
            setError(`エラー: ${error.message}`);
            return;
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 2000);
        }
    };


    return (
        <div className="main">
            <h2>材料を追加</h2>
            <form onSubmit={handleNewIng} className="form">
                <div className='input-name'>
                    <label htmlFor="ingName">材料名</label>
                    <input
                        id="ingName"
                        type="text"
                        value={newIngName}
                        onChange={(e) => setNewIngName(e.target.value)}
                        placeholder="材料の名前を入力"
                        autoComplete='off'
                    />
                </div>
                <div className='input-cat'>
                    <label htmlFor="category">カテゴリー</label>
                    <select
                        id="category"
                        value={newIngCat}
                        onChange={(e) => setNewIngCat(e.target.value)}
                    >
                        <option value="">カテゴリーを選択</option>
                        {catData.map((cat: catType) => (
                            <option key={cat.cat_id} value={cat.cat_id}>
                                {cat.cat_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">追加</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default AddIng;