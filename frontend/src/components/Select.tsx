import type { catType } from '../types/type.ts';

type SelectProps = {
    showCatId: string;
    setShowCatId: React.Dispatch<React.SetStateAction<string>>;
    catData: catType[];
};

function Select({ showCatId, setShowCatId, catData }: SelectProps) {
    return (
        <select
            value={showCatId}
            onChange={(e) => setShowCatId(e.target.value)}
        >
            <option value="">すべてのカテゴリー</option>
            {catData.map((cat: catType) => (
                <option key={cat.cat_id} value={cat.cat_id}>
                    {cat.cat_name}
                </option>
            ))}
        </select>
    );
}

export default Select;