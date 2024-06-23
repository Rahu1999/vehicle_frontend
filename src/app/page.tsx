import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="container" >
      <Input type="email" placeholder="Email" />
      <Button>Click me</Button>
    </div>
  );
}
