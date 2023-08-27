import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import SolitaireGame from '../components/SolitaireGame';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Solitaire</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Solitaire</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SolitaireGame />
      </IonContent>
    </IonPage>
  );
};

export default Home;
