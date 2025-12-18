import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import { AuthProvider } from "@/lib/authContext";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Activities from "@/pages/activities";
import Wallet from "@/pages/wallet";
import Register from "@/pages/register";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import StartupLeaders from "@/pages/startup-leaders";
import ProfessionalsZone from "@/pages/professionals-zone";
import HonoraryPioneers from "@/pages/honorary-pioneers";
import Blog from "@/pages/blog";
import About from "@/pages/about";
import Mission from "@/pages/mission";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Terms from "@/pages/terms";
import Suggestions from "@/pages/suggestions";
import Leaderboard from "@/pages/leaderboard";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/activities" component={Activities} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/admin" component={Admin} />
        <Route path="/startup-leaders" component={StartupLeaders} />
        <Route path="/professionals-zone" component={ProfessionalsZone} />
        <Route path="/honorary-pioneers" component={HonoraryPioneers} />
        <Route path="/blog" component={Blog} />
        <Route path="/about" component={About} />
        <Route path="/about/mission" component={Mission} />
        <Route path="/about/contact" component={Contact} />
        <Route path="/terms" component={Terms} />
        <Route path="/suggestions" component={Suggestions} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
