import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
public class Test extends HttpServlet
{
    public void doPost(HttpServletRequest r, HttpServletResponse rs) throws IOException, ServletException
    {
        rs.setContentType("text/html");
        PrintWriter out = rs.getWriter();
        String name = r.getParameter("n");
        int amount = Integer.parseInt(r.getParameter("a"));
        double discount = 0;
        if(amount >= 5000)
            discount = amount * 0.20;
        else if(amount >= 3000)
            discount = amount * 0.15;
        else if(amount >= 1000)
            discount = amount * 0.10;
        else
            discount = 0;
        double finalAmount = amount - discount;
        out.print("Name: " + name + "<br>");
        out.print("Purchase Amount: " + amount + "<br>");
        out.print("Discount: " + discount + "<br>");
        out.print("Final Amount: " + finalAmount);
        out.print("<br><br><br><h3>24071A05F9 copyrights reserved </h3>");
        out.close();
    }
}