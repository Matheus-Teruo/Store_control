import os
import cv2 as cv
import numpy as np

from identify_table import IdentifyTable

def main():
  caminho_pasta = "example_data"

  for nome_arquivo in os.listdir(caminho_pasta):
    caminho_completo = os.path.join(caminho_pasta, nome_arquivo)

    if os.path.isfile(caminho_completo):
      image = cv.imread(caminho_completo)
      identify_table = IdentifyTable(image, True)

      scale_percent = 50
      width = int(image.shape[1] * scale_percent / 100)
      height = int(image.shape[0] * scale_percent / 100)
      dim = (width, height)

      aux = cv.resize(identify_table.threshold_image, dim, interpolation=cv.INTER_AREA)
      cv.imshow("Threshold_image", aux)
      aux = cv.resize(identify_table.image_with_all_contours, dim, interpolation=cv.INTER_AREA)
      cv.imshow("image_with_all_contours", aux)
      aux = cv.resize(identify_table.image_with_contour_with_max_area, dim, interpolation=cv.INTER_AREA)
      cv.imshow("Bigger_rectangle_image", aux)
      aux = cv.resize(identify_table.image_with_points_plotted, dim, interpolation=cv.INTER_AREA)
      cv.imshow("Image_with_points_plotted", aux)
      aux = cv.resize(identify_table.perspective_corrected_image, dim, interpolation=cv.INTER_AREA)
      cv.imshow("Perspective_corrected_image", aux)
      cv.waitKey()
  

if __name__ == "__main__":
  main()
