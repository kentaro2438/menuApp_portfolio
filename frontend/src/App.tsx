import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Result from "./pages/Result";
import AddIng from "./pages/AddIng";
import AddDish from "./pages/AddDish";
import ListIng from "./pages/ListIng";
import ListDish from "./pages/ListDish";
import EditIng from "./pages/EditIng";
import EditDish from "./pages/EditDish";
import Refrigerator from "./pages/Refrigerator";
import ShoppingList from "./pages/ShoppingList";
import Layout from "./components/Layout";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
    return (
        <NotificationProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/refrigerator" element={<Refrigerator />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/result" element={<Result />} />
                        <Route path="/list_ing" element={<ListIng />} />
                        <Route path="/list_dish" element={<ListDish />} />
                        <Route path="/list_ing/add" element={<AddIng />} />
                        <Route path="/list_ing/edit/:ing_id" element={<EditIng />} />
                        <Route path="/list_dish/add" element={<AddDish />} />
                        <Route path="/list_dish/edit/:dish_id" element={<EditDish />} />
                        <Route path="/shopping" element={<ShoppingList />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </NotificationProvider>
    )
};

export default App;