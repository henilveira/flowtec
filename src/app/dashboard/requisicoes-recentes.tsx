import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Request {
  name: string
  email: string
  avatar?: string
}

export default function RecentRequests() {
  const requests: Request[] = [
    {
      name: "Luz Contadores",
      email: "Alteração Contratual",
    },
    {
      name: "Empresa de Márcio",
      email: "Abertura de Empresa",
    },
    {
      name: "EcoWave",
      email: "Baixa",
    },


  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Requisições recentes</CardTitle>
        <p className="text-sm text-muted-foreground">
          Você abriu 3 requisições hoje
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        {requests.map((request) => (
          <div key={request.email} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={request.avatar} alt={request.name} />
              <AvatarFallback>
                {request.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <div className="text-sm font-medium">{request.name}</div>
              <div className="text-sm text-muted-foreground">{request.email}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

