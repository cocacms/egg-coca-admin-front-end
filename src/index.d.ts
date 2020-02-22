import { RouteComponentProps } from 'react-router';
import { Location } from 'history';

interface ILocation extends Location {
  query: { [key: string]: string };
}
interface IRouteComponentProps<Params = any> extends RouteComponentProps<Params> {
  location: ILocation;
}
