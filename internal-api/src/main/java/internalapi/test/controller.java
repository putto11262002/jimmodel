package internalapi.test;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller()
public class controller {

    @GetMapping("/")
    public ResponseEntity<String> testGet(){
        return ResponseEntity.ok().body("Hello world");
    }
    
}
