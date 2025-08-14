import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import ProductPage from "@/pages/product/[id]";
import ChickenShoyuPage from "@/pages/ramen/chicken-shoyu";
import TonkotsuShoyuPage from "@/pages/ramen/tonkotsu-shoyu";
import ProductsPage from "@/pages/products";
import Webshop from "@/pages/webshop";
import WorkshopsPage from "@/pages/workshops";
import KombuchaWorkshop from "@/pages/kombucha-workshop";
import WorkshopDetails from "@/pages/workshop-details";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/webshop" component={Webshop} />
      <Route path="/workshops" component={WorkshopsPage} />
      <Route path="/producten/:slug" component={ProductDetail} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/ramen/chicken-shoyu" component={ChickenShoyuPage} />
      <Route path="/ramen/tonkotsu-shoyu" component={TonkotsuShoyuPage} />
      <Route path="/kombucha-workshop" component={KombuchaWorkshop} />
      <Route path="/workshop-details" component={WorkshopDetails} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
