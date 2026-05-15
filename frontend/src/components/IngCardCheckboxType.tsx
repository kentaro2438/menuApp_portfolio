import type { ingType, catType } from '../types/type.ts';

function IngCardCheckboxType({ ing, catData, selectedIngIds, handleCheckboxChange }:
    { ing: ingType, catData: catType[], selectedIngIds: number[], handleCheckboxChange: (id: number) => void }) {
    const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
    const catId = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_id || 0;
    return (
        <div key={ing.ing_id} className="card">
            <div className='card-row'>
                <p className='name'>
                    {ing.ing_name}
                </p>
                <div className='card-right'>
                    <span className={`cat-name cat-${catId}`}>
                        {catName}
                    </span>
                    <input
                        type="checkbox"
                        checked={selectedIngIds.includes(ing.ing_id)}
                        onChange={() => handleCheckboxChange(ing.ing_id)}
                    />
                </div>

            </div>

        </div>
    );
};

export default IngCardCheckboxType;
