import '../reset.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCat, getIng, editIng } from '../api/api.js';
import type { catType } from '../types/type.ts';
import Select from '../components/Select.tsx';
import Input from '../components/Input.tsx';

function EditIng() {
    const { ing_id } = useParams();

    const [editedIngName, setEditedIngName] = useState<string>('');
    const [editedIngCat, setEditedIngCat] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [catData, setCatData] = useState<catType[]>([]);

    //カテゴリーを取得
    const fetchGetCat = async () => {
        const data = await getCat();
        setCatData(data.cat_list);
    };

    //特定の材料を取得
    const fetchGetIng = async () => {
        const data = await getIng(Number(ing_id));
        setEditedIngName(data.ing_name);
        setEditedIngCat(data.cat_id.toString());
    };

    useEffect(() => {
        fetchGetCat();
        fetchGetIng();
    }, []);

    const handleEditedIng = async (e: any) => {
        e.preventDefault();

        const trimmedEditedIngName = editedIngName.trim();
        if (!trimmedEditedIngName) {
            setError('材料名を入力してください');
            return;
        }
        if (!editedIngCat) {
            setError('カテゴリーを選択してください');
            return;
        }

        try {
            await editIng(Number(ing_id), trimmedEditedIngName, parseInt(editedIngCat));
            setSuccessMessage('材料が正常に編集されました。');
            setEditedIngName('');
            setEditedIngCat('');
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
            <h2>材料を編集</h2>
            <form onSubmit={handleEditedIng} className="form">
                <div className='input-name'>
                    <label htmlFor="ingName">材料名</label>
                    <Input
                        word={editedIngName}
                        setWord={setEditedIngName}
                        placeholder="材料名を入力"
                    />
                </div>

                <div className='input-cat'>
                    <label htmlFor="category">カテゴリー</label>
                    <Select
                        showCatId={editedIngCat}
                        setShowCatId={setEditedIngCat}
                        catData={catData}
                    />
                </div>

                <button type="submit">保存</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default EditIng;