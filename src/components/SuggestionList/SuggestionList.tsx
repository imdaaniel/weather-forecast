import CitySuggestion from '../../interfaces/CitySuggestion';
import './style.css';

type Props = {
  data: CitySuggestion[],
  onClick: Function
}

function SuggestionList({ data, onClick }: Props) {
  return (
    <ul id="suggestions">
      {data.map((city, index) => (
        <li
          key={index}
          onClick={() => onClick(city)}
        >{city.name}</li>
      ))}
    </ul>
  );
}

export default SuggestionList;