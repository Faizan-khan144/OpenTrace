import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppProvider } from './context/AppProvider.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ResourcePage from './pages/ResourcePage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import RecentPage from './pages/RecentPage.jsx'
import SubmitPage from './pages/SubmitPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/explore', element: <ExplorePage /> },
      { path: '/category/:categoryId', element: <CategoryPage /> },
      { path: '/resource/:id', element: <ResourcePage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/collections', element: <CollectionsPage /> },
      { path: '/recent', element: <RecentPage /> },
      { path: '/submit', element: <SubmitPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}