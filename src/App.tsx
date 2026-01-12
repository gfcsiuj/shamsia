import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Instructors from './pages/Instructors';
import About from './pages/About';
import Contact from './pages/Contact';
import Library from './pages/Library';
import CourseRegister from './pages/CourseRegister';

const App: React.FC = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/courses" component={Courses} />
        <Route exact path="/courses/:id/register" component={CourseRegister} />
        <Route exact path="/courses/:id" component={CourseDetails} />
        <Route exact path="/register" component={CourseRegister} />
        <Route exact path="/library" component={Library} />
        <Route exact path="/instructors" component={Instructors} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
    </Layout>
  );
};

export default App;