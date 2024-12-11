import cv2 as cv
import numpy as np

class IdentifyTable:
  def __init__(self, image, debug=False):
    self.debug = debug
    self.image = image
    self.original_image = image.copy()
    
    self.convert_image_to_grayscale()
    mean_value_bright = np.mean(self.image)
    self.ajusts_bright_contrast(self.calculate_alpha(mean_value_bright) ,10)
    self.threshold_image(self.invert_mean_value(mean_value_bright))
    self.invert_image()
    self.dilate_image()
    
    self.find_contours()
    self.filter_contours_and_leave_only_rectangles()
    self.find_largest_contour_by_area()

    self.order_points_in_the_contour_with_max_area()
    self.calculate_new_width_and_height_of_image()
    self.apply_perspective_transform()

  def convert_image_to_grayscale(self):
    self.image = cv.cvtColor(self.image, cv.COLOR_BGR2GRAY)
  
  def ajusts_bright_contrast(self, alpha=1.0, beta=0):
    self.image = cv.convertScaleAbs(self.image, alpha=alpha, beta=beta)
    if self.debug:
      self.ajusts_bright_contrast_image = self.image.copy()
  
  # def ajusts_contraste_laplace(self):
  #   imagem_laplace = cv.Laplacian(self.image, cv.CV_8U)
  #   sobelx = cv.Sobel(imagem_laplace, cv.CV_8U, 1, 0, ksize=3)
  #   sobely = cv.Sobel(imagem_laplace, cv.CV_8U, 0, 1, ksize=3)
  #   self.image = cv.add(sobelx, sobely)
  
  def threshold_image(self, mean_value=125):
    self.image = cv.threshold(self.image, mean_value, 255, cv.THRESH_BINARY)[1]
    if self.debug:
      self.threshold_image = self.image.copy()
  
  def invert_image(self):
    self.image = cv.bitwise_not(self.image)
  
  def dilate_image(self):
    self.image = cv.dilate(self.image, None, iterations=4)
    if self.debug:
      self.dilatate_image = self.image.copy()

  def find_contours(self):
    self.contours, self.hierarchy = cv.findContours(self.image, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    
    if self.debug:
      self.image_with_all_contours = self.original_image.copy()
      cv.drawContours(self.image_with_all_contours, self.contours, -1, (0, 255, 0), 3)
  
  def filter_contours_and_leave_only_rectangles(self):
    self.rectangular_contours = []
    for contour in self.contours:
      peri = cv.arcLength(contour, True)
      approx = cv.approxPolyDP(contour, 0.02 * peri, True)
      if len(approx) == 4:
        self.rectangular_contours.append(approx)
    
    if self.debug:
      self.image_with_only_rectangular_contours = self.original_image.copy()
      cv.drawContours(self.image_with_only_rectangular_contours, self.rectangular_contours, -1, (0, 255, 0), 3)
  
  def find_largest_contour_by_area(self):
    max_area = 0
    max_w = 0
    self.contour_with_max_area = None
    self.largest_contour = None
    for contour in self.rectangular_contours:
      x, y, w, h = cv.boundingRect(contour)
      area = cv.contourArea(contour)

      if w > max_w:
        max_w = w
        self.largest_contour = contour

      if area > max_area:
        max_area = area
        self.contour_with_max_area = contour

    if self.debug:
      self.image_with_contour_with_max_area = self.original_image.copy()
      cv.drawContours(self.image_with_contour_with_max_area, [self.largest_contour], -1, (0, 255, 0), 3)
  
  def order_points_in_the_contour_with_max_area(self):
    self.contour_with_max_area_ordered = self.order_points(self.contour_with_max_area)
    
    if self.debug:
      self.image_with_points_plotted = self.original_image.copy()
      for point in self.contour_with_max_area_ordered:
        point_coordinates = (int(point[0]), int(point[1]))
        self.image_with_points_plotted = cv.circle(self.image_with_points_plotted, point_coordinates, 10, (0, 0, 255), -1)
  
  def calculate_new_width_and_height_of_image(self):
    existing_image_width = self.image.shape[1]
    existing_image_width_reduced_by_10_percent = int(existing_image_width * 0.9)
    
    distance_between_top_left_and_top_right = self.calculateDistanceBetween2Points(self.contour_with_max_area_ordered[0], self.contour_with_max_area_ordered[1])
    distance_between_top_left_and_bottom_left = self.calculateDistanceBetween2Points(self.contour_with_max_area_ordered[0], self.contour_with_max_area_ordered[3])
    aspect_ratio = distance_between_top_left_and_bottom_left / distance_between_top_left_and_top_right
    self.new_image_width = existing_image_width_reduced_by_10_percent
    self.new_image_height = int(self.new_image_width * aspect_ratio)
  
  def apply_perspective_transform(self):
    pts1 = np.float32(self.contour_with_max_area_ordered)
    pts2 = np.float32([[0, 0], [self.new_image_width, 0], [self.new_image_width, self.new_image_height], [0, self.new_image_height]])
    matrix = cv.getPerspectiveTransform(pts1, pts2)
    self.perspective_corrected_image = cv.warpPerspective(self.original_image, matrix, (self.new_image_width, self.new_image_height))
  
  def calculate_alpha(self, mean_value):
    return mean_value * (-0.5/255) + 1.3
  
  def invert_mean_value(self, mean_value):
    return mean_value * (-3/4) + 255

  def calculateDistanceBetween2Points(self, p1, p2):
    return ((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2) ** 0.5
  
  def order_points(self, pts):
    pts = pts.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    
    return rect