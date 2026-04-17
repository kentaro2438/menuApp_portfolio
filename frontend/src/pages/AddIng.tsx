import '../reset.css';
import { useState, useEffect } from 'react';
import { getCat, addIng } from '../api/api.js';
import type { catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

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
            <form onSubmit={handleNewIng}>
                <div className="input-area">
                    <Input
                        word={newIngName}
                        setWord={setNewIngName}
                        placeholder="材料名を入力"
                    />
                    <Select
                        showCatId={newIngCat}
                        setShowCatId={setNewIngCat}
                        catData={catData}
                    />
                    <button type="submit">追加</button>
                </div>
            </form>
            {successMessage && <p className='success-message'>{successMessage}</p>}
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
}

export default AddIng;