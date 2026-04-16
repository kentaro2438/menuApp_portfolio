import '../reset.css';
import { Link, useLocation } from "react-router-dom";

type ResultItemType = [string, number, number, string[]];

type LocationStateType = {
    selectedIngIds?: number[];
    resultList?: ResultItemType[];
};

function Result() {
    const location = useLocation();
    const state = location.state as LocationStateType | null;

    const selectedIngIds = state?.selectedIngIds || [];
    const resultList = state?.resultList || [];

    return (
        <div className="main">
            <h2>Results</h2>
            <div>
                {selectedIngIds.length === 0 ? (
                    <p>検索する材料が選択されていません</p>
                ) : resultList.length === 0 ? (
                    <p>該当する料理が見つかりませんでした</p>
                ) : (
                    <div className="card-container">
                        {resultList.map((result, index) => (
                            <div key={index} className='card'>
                                <h3>{result[0]}</h3>
                                <p>一致した材料数: {result[1]}</p>
                                <p>不足材料数: {result[2]}</p>
                                <p>
                                    不足材料:
                                    {result[3].length > 0
                                        ? ` ${result[3].join("、")}`
                                        : " なし"}
                                </p>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(result[0] + ' レシピ')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    レシピを検索
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Link to="/search">
                <button type="button">検索に戻る</button>
            </Link>
        </div>
    );
}

export default Result;