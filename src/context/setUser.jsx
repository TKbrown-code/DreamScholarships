// Parent component
import Form from "./Form";

const [user, setUser] = useState(null);

<Form setUser={setUser} />  // ✅ pass it as a prop
