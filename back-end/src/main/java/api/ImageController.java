package api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletContext;
import javax.servlet.http.Part;
import javax.sql.rowset.serial.SerialBlob;
import java.io.File;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ServletContext servletContext;
    @GetMapping
    public List<String> getAllImages(UriComponentsBuilder uriBuilder) {
        ArrayList<String> imageFileList = new ArrayList<>();
        String imgDirPath = servletContext.getRealPath("/images");
        File imgDir = new File(imgDirPath);
        String[] imageFileNames = imgDir.list();
        for (String imageFileName : imageFileNames) {
            UriComponentsBuilder cloneBuilder = uriBuilder.cloneBuilder();
            String url = cloneBuilder.pathSegment("images", imageFileName).toUriString();
            imageFileList.add(url);
        }
        return imageFileList;
    };
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<String> saveImages(@RequestPart("images") List<Part> imageFiles ,UriComponentsBuilder uriComponentsBuilder) {
        List<String> imageUrlList = new ArrayList<>();
        if (imageFiles != null) {
            String imageDirPath = servletContext.getRealPath("/images");
            for (Part imageFile:imageFiles) {
                String imageFilePath = new File(imageDirPath, imageFile.getSubmittedFileName()).getAbsolutePath();
                try{
                    UriComponentsBuilder cloneBuilder = uriComponentsBuilder.cloneBuilder();
                    String imageUrl = cloneBuilder.pathSegment("images", imageFile.getSubmittedFileName()).toUriString();
                    imageFile.write(imageFilePath);
                    imageUrlList.add(imageUrl);

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return imageUrlList;
    }
};
